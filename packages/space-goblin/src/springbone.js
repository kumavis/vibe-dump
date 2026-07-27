import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Spring bones
//
// The ears and the tail are part of the *skeleton*, not accessories, so they
// can't be handed to the verlet solver in dynamics.js — they have to end up as
// bone rotations that the skin deforms with. This is the classic spring-bone
// integrator: track each bone's tip as a free point (inertia + gravity + a
// spring back towards the animated rest tip), re-constrain it to the bone's
// length, then solve the rotation that points the bone at it.
//
// Because the tip is integrated in *world* space, every bit of motion the
// animation gives the head or hips automatically shows up as ear flap and tail
// whip — no explicit coupling needed.
// ---------------------------------------------------------------------------

const _restTip = new THREE.Vector3()
const _pos = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _next = new THREE.Vector3()
const _inertia = new THREE.Vector3()
const _spring = new THREE.Vector3()
const _pq = new THREE.Quaternion()
const _ps = new THREE.Vector3()
const _local = new THREE.Vector3()

export class SpringBone {
  /**
   * @param {THREE.Bone} bone
   * @param {THREE.Vector3} restTipLocal  tip position in the bone's own space
   * @param {object} o
   * @param {number} [o.stiffness=0.09]  pull back to the animated pose, 0..1
   * @param {number} [o.drag=0.16]       velocity loss per step
   * @param {number} [o.gravity=0.9]     m/s^2 (scaled; these are light parts)
   * @param {THREE.Vector3} [o.gravityDir]
   */
  constructor(bone, restTipLocal, { stiffness = 0.09, drag = 0.16, gravity = 0.9, gravityDir } = {}) {
    this.bone = bone
    this.restTipLocal = restTipLocal.clone()
    this.length = restTipLocal.length()
    this.restDir = restTipLocal.clone().normalize()
    this.stiffness = stiffness
    this.drag = drag
    this.gravity = gravity
    this.gravityDir = (gravityDir || new THREE.Vector3(0, -1, 0)).clone()
    this.curr = new THREE.Vector3()
    this.prev = new THREE.Vector3()
    this.initialised = false
  }

  /** World position of the bone's own origin (its rotation doesn't move it). */
  originWorld(out) {
    return out.setFromMatrixPosition(this.bone.matrixWorld)
  }

  reset() {
    this.bone.parent.updateMatrixWorld(true)
    this.bone.quaternion.identity()
    this.bone.updateMatrixWorld(true)
    _restTip.copy(this.restTipLocal).applyMatrix4(this.bone.matrixWorld)
    this.curr.copy(_restTip)
    this.prev.copy(_restTip)
    this.initialised = true
  }

  /**
   * @param {number} dt
   * @param {THREE.Vector3} [external] world-space acceleration to inject
   *        (apparent wind from running, the shock of a foot strike, ...)
   */
  step(dt, external) {
    if (!this.initialised) {
      this.reset()
      return
    }
    const bone = this.bone
    // Where the tip *would* be if the bone simply followed the animation.
    bone.quaternion.identity()
    bone.updateMatrixWorld(true)
    _restTip.copy(this.restTipLocal).applyMatrix4(bone.matrixWorld)
    this.originWorld(_pos)

    _inertia.subVectors(this.curr, this.prev).multiplyScalar(1 - this.drag)
    _spring.subVectors(_restTip, this.curr)
    _next
      .copy(this.curr)
      .add(_inertia)
      .addScaledVector(_spring, this.stiffness)
      .addScaledVector(this.gravityDir, this.gravity * dt * dt)
    if (external) _next.addScaledVector(external, dt * dt)

    // Keep the tip on the sphere of the bone's length — this is what makes it
    // a rotation rather than a stretch.
    _dir.subVectors(_next, _pos)
    const len = _dir.length()
    if (len < 1e-7) _dir.copy(this.restDir).applyQuaternion(bone.getWorldQuaternion(_pq))
    else _dir.divideScalar(len)
    _next.copy(_pos).addScaledVector(_dir, this.length)

    this.prev.copy(this.curr)
    this.curr.copy(_next)

    // Solve the local rotation that aims the bone at the tip.
    bone.parent.matrixWorld.decompose(_ps, _pq, _local)
    _local.copy(_dir).applyQuaternion(_pq.invert()).normalize()
    bone.quaternion.setFromUnitVectors(this.restDir, _local)
    bone.updateMatrixWorld(true)
  }
}

/**
 * A chain of spring bones. Later bones get progressively looser so the tip
 * trails the base — a uniform chain reads as a rigid rod that happens to move.
 */
export class SpringChain {
  /**
   * @param {THREE.Bone[]} bones      parent-to-tip order
   * @param {THREE.Vector3} tipStub   tip offset for the final (leaf) bone
   * @param {object} o                per-chain defaults, scaled along the chain
   */
  constructor(bones, tipStub, o = {}) {
    this.springs = []
    for (let i = 0; i < bones.length; i++) {
      const bone = bones[i]
      const child = bones[i + 1]
      const tip = child ? child.position.clone() : tipStub.clone()
      const t = bones.length > 1 ? i / (bones.length - 1) : 0
      this.springs.push(
        new SpringBone(bone, tip, {
          stiffness: THREE.MathUtils.lerp(o.stiffness ?? 0.14, o.stiffnessTip ?? 0.05, t),
          drag: THREE.MathUtils.lerp(o.drag ?? 0.22, o.dragTip ?? 0.1, t),
          gravity: THREE.MathUtils.lerp(o.gravity ?? 0.8, o.gravityTip ?? 1.6, t),
          gravityDir: o.gravityDir,
        }),
      )
    }
  }

  reset() {
    for (const s of this.springs) s.reset()
  }

  step(dt, external) {
    // Parent first: each bone's step calls updateMatrixWorld, so the child
    // sees an already-solved parent and the chain settles in one pass.
    for (const s of this.springs) s.step(dt, external)
  }
}

/**
 * Convenience: build chains for a set of bone-name lists.
 * @param {Record<string, THREE.Bone>} byName
 * @param {{names: string[], stub: number[], opts?: object}[]} defs
 */
export function buildChains(byName, defs) {
  const chains = []
  for (const def of defs) {
    const bones = def.names.map((n) => byName[n]).filter(Boolean)
    if (bones.length === 0) continue
    chains.push(new SpringChain(bones, new THREE.Vector3(...def.stub), def.opts || {}))
  }
  return chains
}
