import * as THREE from 'three'
import { OBB } from 'three/examples/jsm/math/OBB.js'

// ---------------------------------------------------------------------------
// The rig: rigid bodies, one joint each, and a machine that checks the folding
//
// Every fold-out module in this scene is a tree of rigid parts. A part hangs off
// exactly one parent by exactly one joint — a hinge (revolute) or a slide
// (prismatic) — and the whole assembly is driven by a single scalar: how far
// through the deployment we are.
//
// That restriction is the point. A real fold-out structure is built from hinges
// and slides; if a design needs a part to move in a way this rig cannot express,
// the design needs another linkage, not a cheat. So the model can't quietly do
// something the steel couldn't.
//
// TWO THINGS EARN THEIR KEEP HERE.
//
// 1. THE PIVOT IS THE PART'S ORIGIN. A part's geometry is authored with the
//    hinge line through (0,0,0), and the part is *placed* by its pivot in the
//    parent's frame. This is the difference between "rotate the panel" and
//    "rotate the panel about its hinge", and getting it wrong is why fold
//    animations usually look like the parts are swimming.
//
// 2. THE AUDIT. Each part carries collision hulls in its own frame. `audit()`
//    walks the deployment in small steps and does an exact OBB-vs-OBB
//    separating-axis test on every pair of parts that isn't a parent/child or an
//    explicitly-declared mating pair. If any two boxes ever share space, the
//    fold is a lie and the audit says so, with the part names and the frame it
//    happened on. The ground and the truck itself are in the hull set too, so a
//    panel that sweeps through the tarmac or clips the cab is caught the same
//    way.
//
// Which means the claim "these do not fold through themselves" is checked in
// the app rather than asserted in a README, and you can watch it being checked.
// ---------------------------------------------------------------------------

const _v = new THREE.Vector3()
const _q = new THREE.Quaternion()
const _m = new THREE.Matrix4()
const _mr = new THREE.Matrix4()
const _scratchScale = new THREE.Vector3()

/** Smoothstep-ish ease used for every joint unless a part asks for linear. */
export function ease(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/**
 * One rigid body.
 *
 * The `group` is what the scene graph sees. Its transform is (pivot · joint),
 * and the part's geometry lives inside it, authored about the pivot.
 */
class Part {
  constructor(spec) {
    this.id = spec.id
    this.parentId = spec.parent ?? null
    this.jointType = spec.joint ?? 'fixed'
    this.stage = spec.stage ?? 0
    this.window = spec.window ?? null // explicit [from, to] in global progress
    this.easing = spec.easing !== false
    this.label = spec.label ?? spec.id
    this.note = spec.note ?? ''

    this.pivot = new THREE.Vector3().fromArray(spec.pivot ?? [0, 0, 0])
    this.axis = new THREE.Vector3().fromArray(spec.axis ?? [0, 0, 1]).normalize()
    // Orientation of the part's frame at rest, applied before the joint. Lets a
    // panel be authored axis-aligned and then mounted at a rake.
    this.rest = spec.rest
      ? new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3().fromArray(spec.rest[0]).normalize(),
          spec.rest[1],
        )
      : null

    const range = spec.range ?? [0, 0]
    this.from = range[0]
    this.to = range[1]

    this.group = new THREE.Group()
    this.group.name = spec.id
    this.hulls = (spec.hulls ?? []).map(normaliseHull)
    /** ids this part is allowed to touch — latch faces, seated feet, sockets. */
    this.mates = new Set(spec.mates ?? [])
    this.static = spec.static === true
    this.children = []
    this.q = 0 // current joint value, in radians or metres
  }

  /** Apply a joint value. Hinge rotates about `axis`; slide translates along it. */
  setJoint(q) {
    this.q = q
    const g = this.group
    if (this.jointType === 'slide' || this.jointType === 'telescope') {
      g.position.copy(this.pivot).addScaledVector(this.axis, q)
      g.quaternion.copy(this.rest ?? IDENTITY)
    } else if (this.jointType === 'hinge') {
      g.position.copy(this.pivot)
      _q.setFromAxisAngle(this.axis, q)
      if (this.rest) g.quaternion.copy(this.rest).premultiply(_q)
      else g.quaternion.copy(_q)
    } else {
      g.position.copy(this.pivot)
      g.quaternion.copy(this.rest ?? IDENTITY)
    }
  }
}

const IDENTITY = new THREE.Quaternion()

/** `{c:[x,y,z], s:[w,h,d], rot?:[[ax,ay,az], angle]}` -> a reusable half-extent box. */
function normaliseHull(h) {
  const centre = new THREE.Vector3().fromArray(h.c ?? [0, 0, 0])
  const half = new THREE.Vector3().fromArray(h.s ?? [0.1, 0.1, 0.1]).multiplyScalar(0.5)
  const rot = h.rot
    ? new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3().fromArray(h.rot[0]).normalize(), h.rot[1])
    : new THREE.Quaternion()
  // Local matrix of the hull inside the part.
  const local = new THREE.Matrix4().compose(centre, rot, new THREE.Vector3(1, 1, 1))
  return { half, local, tag: h.tag ?? '' }
}

export class Rig {
  constructor(name = 'rig') {
    this.name = name
    this.root = new THREE.Group()
    this.root.name = name
    this.parts = new Map()
    this.order = [] // topological: parents always before children
    this.stageCount = 0
    this.stageLabels = []
  }

  /**
   * @param {object} spec see Part
   * @returns {Part}
   */
  add(spec) {
    const part = new Part(spec)
    if (this.parts.has(part.id)) throw new Error(`rig ${this.name}: duplicate part "${part.id}"`)
    this.parts.set(part.id, part)
    const parent = part.parentId ? this.parts.get(part.parentId) : null
    if (part.parentId && !parent) {
      throw new Error(`rig ${this.name}: part "${part.id}" hangs off unknown parent "${part.parentId}"`)
    }
    if (parent) {
      parent.children.push(part)
      parent.group.add(part.group)
    } else {
      this.root.add(part.group)
    }
    this.order.push(part)
    if (!part.static) this.stageCount = Math.max(this.stageCount, part.stage + 1)
    part.setJoint(part.from)
    return part
  }

  /** Attach authored geometry to a part. Geometry is in part-local coords. */
  attach(id, object3d) {
    const part = this.parts.get(id)
    if (!part) throw new Error(`rig ${this.name}: no part "${id}"`)
    part.group.add(object3d)
    return object3d
  }

  get(id) {
    return this.parts.get(id)
  }

  /** Human-readable stage names shown in the HUD. */
  setStages(labels) {
    this.stageLabels = labels
    this.stageCount = Math.max(this.stageCount, labels.length)
  }

  /**
   * The window of global progress during which a given stage moves.
   *
   * Stages are laid end to end across [0,1] and then each is widened by a small
   * overlap so the deployment reads as one continuous motion rather than a
   * series of stops. The overlap is deliberately less than half a stage, which
   * keeps the *ordering* intact: a stage is always more than half done before
   * the next one starts. Deploy-order constraints — "the roof cannot rise until
   * the walls are up" — survive the prettification.
   */
  stageWindow(stage) {
    const n = Math.max(1, this.stageCount)
    const span = 1 / n
    const overlap = span * 0.28
    const a = stage * span
    const b = a + span
    return [Math.max(0, a - overlap * 0.5), Math.min(1, b + overlap * 0.5)]
  }

  /** Drive the whole assembly from one scalar in [0,1]. */
  setProgress(t) {
    this.t = Math.min(1, Math.max(0, t))
    for (const part of this.order) {
      if (part.static || part.jointType === 'fixed') {
        part.setJoint(part.from)
        continue
      }
      const [a, b] = part.window ?? this.stageWindow(part.stage)
      const raw = b <= a ? (this.t >= b ? 1 : 0) : (this.t - a) / (b - a)
      const u = part.easing ? ease(raw) : Math.min(1, Math.max(0, raw))
      part.setJoint(part.from + (part.to - part.from) * u)
    }
    this.root.updateMatrixWorld(true)
  }

  /**
   * Every (part, hull) pair as a world-space OBB, at the current pose.
   *
   * The OBB objects are cached on the hulls and rewritten in place — audit()
   * calls this a hundred times and only ever compares hulls within one sample,
   * so there is nothing to be gained by allocating fresh boxes each frame.
   */
  worldHulls(out = []) {
    out.length = 0
    for (const part of this.order) {
      if (!part.hulls.length) continue
      for (const h of part.hulls) {
        _m.multiplyMatrices(part.group.matrixWorld, h.local)
        const obb = h.obb ?? (h.obb = new OBB())
        obb.halfSize.copy(h.half)
        obb.center.setFromMatrixPosition(_m)
        // Take rotation only. Everything in this scene is unit-scaled, but a
        // stray scale would silently corrupt the SAT test — which assumes the
        // basis is orthonormal — rather than fail loudly.
        _m.decompose(_v, _q, _scratchScale)
        obb.rotation.setFromMatrix4(_mr.makeRotationFromQuaternion(_q))
        out.push({ part, obb, tag: h.tag })
      }
    }
    return out
  }

  /**
   * Walk the deployment and look for parts sharing space.
   *
   * Returns `{ ok, worst, collisions[], samples }`. A collision is reported once
   * per part pair — the frame where the two were most deeply interpenetrated —
   * because a fold that fails usually fails for many consecutive frames and a
   * list of 400 identical rows helps nobody.
   *
   * Exempt from the test: a part against its own parent or child (they share a
   * hinge line, so their hulls touch by construction), and any pair either side
   * declared a `mate` — a latch seating into its catch, a leg's foot resting on
   * the ground, a panel closing onto its sill. Those are contacts the design
   * *wants*.
   */
  audit({ samples = 96, statics = [] } = {}) {
    const before = this.t ?? 0
    const worst = new Map()
    let pairsTested = 0

    for (let i = 0; i <= samples; i++) {
      const t = i / samples
      this.setProgress(t)
      const hulls = this.worldHulls()
      for (const s of statics) hulls.push(s)

      for (let a = 0; a < hulls.length; a++) {
        for (let b = a + 1; b < hulls.length; b++) {
          const A = hulls[a]
          const B = hulls[b]
          if (A.part === B.part) continue
          if (exempt(A.part, B.part)) continue
          pairsTested++
          const depth = penetration(A.obb, B.obb)
          if (depth <= 0) continue
          const key = A.part.id < B.part.id ? `${A.part.id}|${B.part.id}` : `${B.part.id}|${A.part.id}`
          const prev = worst.get(key)
          if (!prev || depth > prev.depth) {
            worst.set(key, {
              a: A.part.id,
              b: B.part.id,
              aTag: A.tag,
              bTag: B.tag,
              depth,
              t,
            })
          }
        }
      }
    }

    this.setProgress(before)
    const collisions = [...worst.values()].sort((x, y) => y.depth - x.depth)
    return {
      ok: collisions.length === 0,
      collisions,
      samples,
      pairsTested: Math.round(pairsTested / (samples + 1)),
    }
  }
}

function exempt(a, b) {
  if (a.parentId === b.id || b.parentId === a.id) return true
  if (a.mates.has(b.id) || b.mates.has(a.id)) return true
  // Two statics can't move relative to each other; whatever they do, they do it
  // in the authored model and it's not a folding failure.
  if (a.static && b.static) return true
  return false
}

/**
 * Signed penetration depth of two OBBs: >0 means they overlap, and the value is
 * the smallest translation that would separate them.
 *
 * Straight separating-axis theorem: 15 candidate axes (3 face normals each, 9
 * edge cross-products). If any axis separates them the boxes are disjoint, and
 * we can bail on the first one. Otherwise the shallowest overlap across all 15
 * is the penetration depth. Degenerate cross-products (parallel edges) are
 * skipped rather than normalised, which would divide by ~0 and invent a
 * separating axis that isn't there.
 */
const _axes = Array.from({ length: 15 }, () => new THREE.Vector3())
const _ax = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
const _bx = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
const _d = new THREE.Vector3()

export function penetration(A, B) {
  basisOf(A, _ax)
  basisOf(B, _bx)
  let n = 0
  for (let i = 0; i < 3; i++) _axes[n++].copy(_ax[i])
  for (let i = 0; i < 3; i++) _axes[n++].copy(_bx[i])
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      _axes[n].crossVectors(_ax[i], _bx[j])
      if (_axes[n].lengthSq() > 1e-8) {
        _axes[n].normalize()
        n++
      }
    }
  }

  _d.subVectors(B.center, A.center)
  let min = Infinity
  for (let i = 0; i < n; i++) {
    const ax = _axes[i]
    const ra =
      A.halfSize.x * Math.abs(ax.dot(_ax[0])) +
      A.halfSize.y * Math.abs(ax.dot(_ax[1])) +
      A.halfSize.z * Math.abs(ax.dot(_ax[2]))
    const rb =
      B.halfSize.x * Math.abs(ax.dot(_bx[0])) +
      B.halfSize.y * Math.abs(ax.dot(_bx[1])) +
      B.halfSize.z * Math.abs(ax.dot(_bx[2]))
    const dist = Math.abs(_d.dot(ax))
    const overlap = ra + rb - dist
    if (overlap <= 0) return 0 // separating axis found — disjoint, done
    if (overlap < min) min = overlap
  }
  return min
}

function basisOf(obb, out) {
  const e = obb.rotation.elements
  out[0].set(e[0], e[1], e[2])
  out[1].set(e[3], e[4], e[5])
  out[2].set(e[6], e[7], e[8])
  return out
}

/** A world-space static hull (ground, truck body) in the same shape audit() wants. */
export function staticHull(id, { c = [0, 0, 0], s = [1, 1, 1], rot = null, mates = [] } = {}) {
  const obb = new OBB()
  obb.center.fromArray(c)
  obb.halfSize.fromArray(s).multiplyScalar(0.5)
  if (rot) {
    _q.setFromAxisAngle(new THREE.Vector3().fromArray(rot[0]).normalize(), rot[1])
    obb.rotation.setFromMatrix4(_mr.makeRotationFromQuaternion(_q))
  }
  return {
    part: { id, parentId: null, static: true, mates: new Set(mates) },
    obb,
    tag: id,
  }
}
