// Secondary motion — the physics that makes the goblin's kit feel *worn*.
//
// Everything hanging off the character (straps, pouches, cables, the torn cape,
// ear-rings, the tail-wrap) is simulated here as Verlet particles under
// position-based constraints. Three forces do the heavy lifting:
//
//   gravity   — the obvious one, pulls the kit down.
//   inertia   — a pseudo-force of -accel applied in the character's frame.
//               This is what makes a strap lag behind on a lunge and whip
//               forward when the goblin plants a foot. Without it the whole
//               rig looks glued on.
//   apparent  — wind = ambient breeze - character velocity. A goblin sprinting
//   wind        into still air feels a headwind, so the cape streams backwards
//               on its own with no animation authoring at all.
//
// Design rules for this file, in priority order:
//   1. It must never explode. dt is clamped, every normalize is guarded, every
//      divide checks its denominator, and there is a last-resort max-stretch
//      projection that runs after the solver regardless of convergence.
//   2. step() allocates nothing. All scratch is module-level and all buffers are
//      preallocated. ~14 strands + 2 cloth patches is a per-frame cost we want
//      measured in tens of microseconds, not milliseconds.
//   3. It is deterministic. No Math.random() anywhere — jitter comes from
//      makeRng in noise.js, so a replay is bit-identical.

import * as THREE from 'three'
import { makeRng, noise3, clamp01 } from './noise.js'

// ---------------------------------------------------------------------------
// Tunables. These are the "feel" knobs; per-object params scale them.
// ---------------------------------------------------------------------------
const MAX_STRETCH = 1.5 // hard ceiling: a segment can never exceed this × rest
const COLLIDE_PAD = 0.004 // keep particles just off the skin, not in it
const FRICTION = 0.35 // fraction of tangential velocity killed on contact
const STRAND_WIND_K = 1.6 // strand wind response at wind = 1
const CLOTH_WIND_K = 1.8 // cloth catches far more air than a cable does
const AMBIENT_WIND = 2.0 // m/s of ambient breeze at world wind = 1
const APPARENT_WIND = 1.0 // how much of the character's velocity becomes wind
const MAX_ACCEL = 80 // m/s^2 ceiling on derived character acceleration
const SPRING_K = 0.25 // restoring pull inside an elastic segment's slack band
const MAX_SPEED = 30 // m/s ceiling on any particle — nothing on a goblin is faster

// ---------------------------------------------------------------------------
// Scratch. Namespaced per class so nested calls can never clobber each other.
// ---------------------------------------------------------------------------
const _c0 = new THREE.Vector3()
const _s0 = new THREE.Vector3()
const _s1 = new THREE.Vector3()
const _s2 = new THREE.Vector3()
const _s3 = new THREE.Vector3()
const _k0 = new THREE.Vector3()
const _m0 = new THREE.Vector3()
const _m1 = new THREE.Vector3()
const _m2 = new THREE.Vector3()
const _m3 = new THREE.Vector3()
const _mq = new THREE.Quaternion()
const _w0 = new THREE.Vector3()

const UP = new THREE.Vector3(0, 1, 0)
const DOWN = new THREE.Vector3(0, -1, 0)

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)

/** Largest axis scale of a world matrix — capsules are radially symmetric, so a
 *  non-uniformly scaled bone still gets a capsule that fully contains it. */
function maxScaleOf(m) {
  const e = m.elements
  const sx = Math.hypot(e[0], e[1], e[2])
  const sy = Math.hypot(e[4], e[5], e[6])
  const sz = Math.hypot(e[8], e[9], e[10])
  return Math.max(sx, sy, sz) || 1
}

/** Write into `out` a unit vector perpendicular to `u`. `u` need not be unit.
 *  Used when a collision has no defined push direction. */
function anyPerpendicular(u, out) {
  const ax = Math.abs(u.x)
  const ay = Math.abs(u.y)
  const az = Math.abs(u.z)
  // Cross with whichever cardinal axis is *least* aligned with u — that keeps
  // the cross product well away from zero length.
  if (ax <= ay && ax <= az) out.set(0, -u.z, u.y)
  else if (ay <= az) out.set(-u.z, 0, u.x)
  else out.set(-u.y, u.x, 0)
  const len = out.length()
  if (len < 1e-9) out.set(1, 0, 0)
  else out.multiplyScalar(1 / len)
  return out
}

// ===========================================================================
// CapsuleCollider — a capsule that rides along with a bone.
// ===========================================================================
export class CapsuleCollider {
  /**
   * @param {THREE.Object3D} bone   the collider follows this object's world matrix
   * @param {THREE.Vector3} localA  first endpoint, in the bone's local space
   * @param {THREE.Vector3} localB  second endpoint, in the bone's local space
   * @param {number} radius         capsule radius, in the bone's local units
   */
  constructor(bone, localA, localB, radius) {
    this.bone = bone || null
    this.localA = localA ? localA.clone() : new THREE.Vector3()
    this.localB = localB ? localB.clone() : new THREE.Vector3(0, 1, 0)
    this.radius = radius > 0 ? radius : 0.05
    this.enabled = true

    // World-space state, refreshed by update().
    this.a = new THREE.Vector3()
    this.b = new THREE.Vector3()
    this.worldRadius = this.radius
    this.center = new THREE.Vector3()
    this.bound = this.radius // bounding-sphere radius about `center`

    this._ab = new THREE.Vector3()
    this._abLen2 = 0

    this.update()
  }

  update() {
    const bone = this.bone
    if (bone) {
      // Pull the bone's ancestors up to date ourselves: the character may have
      // posed its skeleton after the renderer's last matrix pass, and a collider
      // one frame stale is a collider the cape walks straight through.
      bone.updateWorldMatrix(true, false)
      this.a.copy(this.localA).applyMatrix4(bone.matrixWorld)
      this.b.copy(this.localB).applyMatrix4(bone.matrixWorld)
      this.worldRadius = this.radius * maxScaleOf(bone.matrixWorld)
    } else {
      this.a.copy(this.localA)
      this.b.copy(this.localB)
      this.worldRadius = this.radius
    }
    this._ab.subVectors(this.b, this.a)
    this._abLen2 = this._ab.lengthSq()
    this.center.addVectors(this.a, this.b).multiplyScalar(0.5)
    this.bound = this.worldRadius + 0.5 * Math.sqrt(this._abLen2)
    return this
  }

  /**
   * Push `p` out to the capsule surface if it is inside. Mutates `p`.
   * @returns {boolean} true if p moved
   */
  resolve(p, pad = 0) {
    if (!this.enabled) return false
    const r = this.worldRadius + pad
    if (!(r > 0)) return false

    // Bounding-sphere reject first: for a cape this skips most colliders on
    // most particles for the cost of three multiplies.
    const cx = p.x - this.center.x
    const cy = p.y - this.center.y
    const cz = p.z - this.center.z
    const reach = this.bound + pad
    if (cx * cx + cy * cy + cz * cz > reach * reach) return false

    // Closest point on the segment ab.
    let t = 0
    if (this._abLen2 > 1e-12) {
      const ab = this._ab
      t = ((p.x - this.a.x) * ab.x + (p.y - this.a.y) * ab.y + (p.z - this.a.z) * ab.z) / this._abLen2
      t = t < 0 ? 0 : t > 1 ? 1 : t
    }
    const qx = this.a.x + this._ab.x * t
    const qy = this.a.y + this._ab.y * t
    const qz = this.a.z + this._ab.z * t

    let nx = p.x - qx
    let ny = p.y - qy
    let nz = p.z - qz
    const d2 = nx * nx + ny * ny + nz * nz
    if (d2 >= r * r) return false

    const d = Math.sqrt(d2)
    if (d < 1e-9) {
      // Dead centre on the axis: there is no push direction to normalize, so
      // pop the particle out sideways rather than dividing by zero.
      if (this._abLen2 > 1e-12) anyPerpendicular(this._ab, _c0)
      else _c0.set(1, 0, 0)
      nx = _c0.x
      ny = _c0.y
      nz = _c0.z
    } else {
      const inv = 1 / d
      nx *= inv
      ny *= inv
      nz *= inv
    }
    p.set(qx + nx * r, qy + ny * r, qz + nz * r)
    return true
  }
}

// ===========================================================================
// Strand — a Verlet chain. Straps, cables, ear-rings, necklaces, tail-wraps.
// ===========================================================================
export class Strand {
  constructor(o) {
    const opts = o || {}
    this.anchor = opts.anchor || null
    this.offset = (opts.offset || new THREE.Vector3()).clone()
    this.dir = (opts.dir || DOWN).clone()
    if (this.dir.lengthSq() < 1e-12) this.dir.copy(DOWN)

    this.length = opts.length > 0 ? opts.length : 0.2
    this.segments = Math.max(2, Math.round(opts.segments || 6))
    this.stiffness = clamp01(opts.stiffness === undefined ? 1 : opts.stiffness)
    this.damping = clamp(opts.damping === undefined ? 0.06 : opts.damping, 0, 0.999)
    this.gravity = opts.gravity === undefined ? -9.8 : opts.gravity
    this.drag = Math.max(0, opts.drag || 0)
    this.stretch = clamp(opts.stretch || 0, 0, 0.8)
    this.wind = clamp01(opts.wind || 0)
    this.pinTip = !!opts.pinTip
    this.twistLock = clamp01(opts.twistLock || 0)

    // Remembers whether the caller picked a gravity, so DynamicsWorld can adopt
    // strands that didn't into the world's gravity without stomping explicit ones.
    this._gravitySet = opts.gravity !== undefined

    this._pinTipLocal = opts.pinTipTo ? opts.pinTipTo.clone() : null

    const n = this.segments + 1
    this.n = n
    this._rest = this.length / this.segments
    // Elastic slack band. stretch = 0 collapses it to a point, which makes the
    // segment exactly inextensible; wider bands let the strand whip and spring.
    this._slackHi = this.stretch
    this._slackLo = this.stretch * 0.4
    this._maxLen = this._rest * Math.max(MAX_STRETCH, 1 + this._slackHi * 1.1)
    // CFL-style guards. A particle may not move more than a couple of segment
    // lengths in one step, and a collider may not shove it more than about one
    // segment. Both are no-ops at any sane dt; at an insane one they turn a
    // blow-up into a few frames of slow motion, which the solver can absorb.
    // The push cap is deliberately just above one rest length: big enough that a
    // single pass clears any contact a fast bone can create in one frame, small
    // enough that a particle buried deep inside a collider (a badly placed
    // anchor) climbs out over a few frames instead of tearing off its chain.
    this._maxMove = this._rest * 2
    this._maxPush = this._rest * 1.2

    // Solver schedule. More stiffness buys both more passes and a heavier
    // correction per pass; both are needed for a taut strap to stay taut.
    this._iters = clamp(Math.round(1 + this.stiffness * 3), 1, 4)
    this._k = 0.5 + 0.5 * this.stiffness

    this._pos = new Array(n)
    this._prev = new Array(n)
    this._w = new Float32Array(n) // inverse-mass-ish weight; 0 = pinned
    this._windW = new Float32Array(n) // wind bites harder toward the free tip
    this._jit = new Float32Array(n * 3) // deterministic separation dirs
    for (let i = 0; i < n; i++) {
      this._pos[i] = new THREE.Vector3()
      this._prev[i] = new THREE.Vector3()
      this._w[i] = i === 0 ? 0 : 1
      this._windW[i] = 0.35 + 0.65 * (i / (n - 1))
    }
    if (this.pinTip) this._w[n - 1] = 0

    const rng = makeRng((opts.seed | 0) || 0x9e37 + n * 131 + Math.round(this.length * 977))
    for (let i = 0; i < n; i++) {
      // Unit-ish random directions used only to break exact coincidence between
      // two particles; magnitude is irrelevant, determinism is not.
      const x = rng() * 2 - 1
      const y = rng() * 2 - 1
      const z = rng() * 2 - 1
      const l = Math.hypot(x, y, z) || 1
      this._jit[i * 3] = x / l
      this._jit[i * 3 + 1] = y / l
      this._jit[i * 3 + 2] = z / l
    }
    this._nx = rng() * 64
    this._ny = rng() * 64
    this._nz = rng() * 64

    // World-space wind, written by DynamicsWorld each frame.
    this.windVector = new THREE.Vector3()

    this._turb = new THREE.Vector3()
    this._rootPrevW = new THREE.Vector3()
    this._tipPrevW = new THREE.Vector3()
    this._restDirW = new THREE.Vector3(0, -1, 0)
    this._t = 0
    this._prevDt = 0
    this._subAlpha = 1 // set by DynamicsWorld per substep; 1 = land on target

    this.reset()
  }

  get points() {
    return this._pos
  }

  /** Snap to the rest pose. Call after a teleport or an animation clip change. */
  reset() {
    const n = this.n
    const anchor = this.anchor
    if (anchor) anchor.updateWorldMatrix(true, false)

    _s0.copy(this.offset)
    if (anchor) _s0.applyMatrix4(anchor.matrixWorld)

    _s1.copy(this.dir)
    if (anchor) _s1.transformDirection(anchor.matrixWorld)
    if (_s1.lengthSq() < 1e-12) _s1.copy(DOWN)
    else _s1.normalize()
    this._restDirW.copy(_s1)

    if (this.pinTip && this._pinTipLocal) {
      _s2.copy(this._pinTipLocal)
      if (anchor) _s2.applyMatrix4(anchor.matrixWorld)
      // A strap that loops back is longer than the straight chord, so lay it out
      // on a sagging arc; otherwise the first solve has to absorb all the slack
      // at once and the strap snaps taut with a visible pop.
      const chord = _s0.distanceTo(_s2)
      const slack = Math.max(0, this.length * this.length - chord * chord)
      const sag = 0.35 * Math.sqrt(slack)
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1)
        this._pos[i].lerpVectors(_s0, _s2, u).addScaledVector(this._restDirW, sag * 4 * u * (1 - u))
      }
      this._tipPrevW.copy(_s2)
    } else {
      for (let i = 0; i < n; i++) {
        this._pos[i].copy(_s0).addScaledVector(this._restDirW, this._rest * i)
      }
      this._tipPrevW.copy(this._pos[n - 1])
      if (this.pinTip && !this._pinTipLocal) {
        // pinTip with no target: hold wherever the rest pose put the tip, in the
        // anchor's local space, so it still tracks the bone.
        this._pinTipLocal = this._pos[n - 1].clone()
        if (anchor) this._pinTipLocal.applyMatrix4(_tmpInverse(anchor))
      }
    }

    for (let i = 0; i < n; i++) this._prev[i].copy(this._pos[i])
    this._rootPrevW.copy(this._pos[0])
    this._prevDt = 0
    this._t = 0 // rewind the noise clock too, or a replay isn't a replay
    this._turb.set(0, 0, 0)
  }

  /**
   * @param {number} dt seconds
   * @param {Array<CapsuleCollider>} colliders may be null
   * @param {THREE.Vector3} accel character's world acceleration, may be null
   */
  step(dt, colliders, accel) {
    const alpha = this._subAlpha
    this._subAlpha = 1
    if (!(dt > 0)) return
    this._t += dt

    const n = this.n
    const pos = this._pos
    const prev = this._prev
    const w = this._w
    const anchor = this.anchor

    // --- root & tip tracking -------------------------------------------------
    // The root is SET to the anchor, never forced toward it: a spring here reads
    // as rubbery lag on a fast bone. Sub-stepping interpolates toward this
    // frame's anchor position so a hard hip snap arrives as motion, not a jump.
    if (anchor) anchor.updateWorldMatrix(true, false)
    _s0.copy(this.offset)
    if (anchor) _s0.applyMatrix4(anchor.matrixWorld)
    const p0 = pos[0]
    prev[0].copy(p0)
    if (alpha >= 1) p0.copy(_s0)
    else p0.lerpVectors(this._rootPrevW, _s0, alpha)

    if (this.pinTip && this._pinTipLocal) {
      _s1.copy(this._pinTipLocal)
      if (anchor) _s1.applyMatrix4(anchor.matrixWorld)
      const pt = pos[n - 1]
      prev[n - 1].copy(pt)
      if (alpha >= 1) pt.copy(_s1)
      else pt.lerpVectors(this._tipPrevW, _s1, alpha)
      if (alpha >= 1) this._tipPrevW.copy(_s1)
    }
    if (alpha >= 1) this._rootPrevW.copy(_s0)

    // Rest direction follows the bone so twistLock's cone rotates with it.
    if (anchor) {
      _s2.copy(this.dir).transformDirection(anchor.matrixWorld)
      if (_s2.lengthSq() > 1e-12) this._restDirW.copy(_s2.normalize())
    }

    // --- turbulence ----------------------------------------------------------
    // One noise sample per strand per step, not per particle: three noise3 calls
    // × 14 strands is free, and the spatial detail along a 10cm strap is below
    // what anyone can see anyway. Per-particle variety comes from _windW.
    if (this.wind > 0) {
      const f = 0.45
      const tt = this._t * 0.55
      const bx = p0.x * f + this._nx
      const by = p0.y * f + this._ny
      const bz = p0.z * f + this._nz
      this._turb.set(
        noise3(bx + tt, by, bz) * 2 - 1,
        (noise3(bx, by + tt, bz + 11.3) * 2 - 1) * 0.55,
        noise3(bx, by, bz + tt + 7.7) * 2 - 1,
      )
    }

    // --- integrate -----------------------------------------------------------
    const damp = Math.pow(1 - this.damping, dt)
    // First step after a reset has no previous dt; treat it as if it were this
    // one so the implied velocity is zero rather than infinite.
    const invPrev = this._prevDt > 1e-8 ? 1 / this._prevDt : 1 / dt
    const g = this.gravity
    const ax0 = accel ? -accel.x : 0
    const ay0 = accel ? -accel.y + g : g
    const az0 = accel ? -accel.z : 0
    const windK = this.wind > 0 ? this.wind * STRAND_WIND_K : 0
    const tx = this.windVector.x + this._turb.x * 1.4
    const ty = this.windVector.y + this._turb.y * 1.4
    const tz = this.windVector.z + this._turb.z * 1.4
    const dragK = this.drag
    const dragCap = 0.9 / dt // an impulse bigger than this would reverse v

    const maxMove = this._maxMove
    for (let i = 1; i < n; i++) {
      if (w[i] === 0) continue
      const p = pos[i]
      const pr = prev[i]
      let vx = (p.x - pr.x) * invPrev
      let vy = (p.y - pr.y) * invPrev
      let vz = (p.z - pr.z) * invPrev
      const sp2 = vx * vx + vy * vy + vz * vz
      if (sp2 > MAX_SPEED * MAX_SPEED) {
        const s = MAX_SPEED / Math.sqrt(sp2)
        vx *= s
        vy *= s
        vz *= s
      }

      let ax = ax0
      let ay = ay0
      let az = az0

      if (windK > 0) {
        // Force is proportional to the air moving *past* the particle, so a
        // strand already travelling with the wind stops being pushed by it.
        const kk = windK * this._windW[i]
        ax += (tx - vx) * kk
        ay += (ty - vy) * kk
        az += (tz - vz) * kk
      }

      if (dragK > 0) {
        const sp = Math.hypot(vx, vy, vz)
        if (sp > 1e-6) {
          let k = dragK * sp
          if (k > dragCap) k = dragCap
          ax -= vx * k
          ay -= vy * k
          az -= vz * k
        }
      }

      let mx = vx * dt * damp + ax * dt * dt
      let my = vy * dt * damp + ay * dt * dt
      let mz = vz * dt * damp + az * dt * dt
      const m2 = mx * mx + my * my + mz * mz
      if (m2 > maxMove * maxMove) {
        const s = maxMove / Math.sqrt(m2)
        mx *= s
        my *= s
        mz *= s
      }
      pr.copy(p)
      p.set(p.x + mx, p.y + my, p.z + mz)
    }

    // --- constraints ---------------------------------------------------------
    const rest = this._rest
    const lo = rest * (1 - this._slackLo)
    const hi = rest * (1 + this._slackHi)
    const elastic = hi > lo
    const kIter = this._k
    const jit = this._jit

    for (let it = 0; it < this._iters; it++) {
      for (let i = 0; i < n - 1; i++) {
        const wa = w[i]
        const wb = w[i + 1]
        const ws = wa + wb
        if (ws <= 0) continue
        const pa = pos[i]
        const pb = pos[i + 1]
        let dx = pb.x - pa.x
        let dy = pb.y - pa.y
        let dz = pb.z - pa.z
        let d2 = dx * dx + dy * dy + dz * dz
        if (d2 < 1e-16) {
          // Perfectly coincident particles have no axis to separate along.
          // Nudge with this segment's fixed jitter direction instead of skipping,
          // or the pair can stay welded together forever.
          const j = i * 3
          dx = jit[j] * 1e-4
          dy = jit[j + 1] * 1e-4
          dz = jit[j + 2] * 1e-4
          d2 = 1e-8
        }
        const d = Math.sqrt(d2)
        let target = d > hi ? hi : d < lo ? lo : d
        // Inside the slack band an elastic segment is free; the weak pull is
        // what eventually walks it back to rest so it doesn't stay stretched.
        if (elastic) target += (rest - target) * SPRING_K
        const diff = ((d - target) / d) * kIter
        const sa = (diff * wa) / ws
        const sb = (diff * wb) / ws
        if (wa > 0) {
          pa.x += dx * sa
          pa.y += dy * sa
          pa.z += dz * sa
        }
        if (wb > 0) {
          pb.x -= dx * sb
          pb.y -= dy * sb
          pb.z -= dz * sb
        }
      }

      // twistLock: keep the first segment from folding back through the anchor.
      // Without it an ear-ring can flip up inside the skull on a hard head turn.
      if (this.twistLock > 0 && w[1] > 0) {
        const pa = pos[0]
        const pb = pos[1]
        _s3.subVectors(pb, pa)
        const len = _s3.length()
        if (len > 1e-9) {
          const proj = _s3.dot(this._restDirW)
          const minProj = -0.25 * len // ~104 degrees of freedom from rest
          if (proj < minProj) {
            _s3.addScaledVector(this._restDirW, (minProj - proj) * this.twistLock)
            const l2 = _s3.length()
            if (l2 > 1e-9) {
              _s3.multiplyScalar(len / l2)
              pb.copy(pa).add(_s3)
            }
          }
        }
      }

      // Collisions live INSIDE the relaxation loop, not after it. A collider
      // shoving a particle out is itself a constraint violation for the two
      // segments either side of it; resolving it here lets the remaining
      // iterations absorb the push along the chain instead of leaving one
      // segment stretched by a whole capsule radius.
      this._collide(colliders)
    }

    // --- contact & the last-resort projection -------------------------------
    // Sandwiched: clamp, collide, clamp. The middle pass clears whatever contact
    // the relaxation loop could not; the final clamp restores the length
    // guarantee, and because it only ever SHORTENS a segment it cannot shove a
    // particle back through a collider by more than it just came out of it.
    this._clamp()
    this._collide(colliders)
    this._clamp()

    this._prevDt = dt
  }

  /** Push every free particle out of every collider. Capped — see _maxPush. */
  _collide(colliders) {
    if (!colliders) return
    const n = this.n
    const pos = this._pos
    const prev = this._prev
    const w = this._w
    const maxPush = this._maxPush
    for (let c = 0; c < colliders.length; c++) {
      const col = colliders[c]
      for (let i = 1; i < n; i++) {
        if (w[i] === 0) continue
        const p = pos[i]
        const ox = p.x
        const oy = p.y
        const oz = p.z
        if (!col.resolve(p, COLLIDE_PAD)) continue
        const mx = p.x - ox
        const my = p.y - oy
        const mz = p.z - oz
        const m2 = mx * mx + my * my + mz * mz
        if (m2 > maxPush * maxPush) {
          const s = maxPush / Math.sqrt(m2)
          p.set(ox + mx * s, oy + my * s, oz + mz * s)
        }
        // Bleed tangential speed so a strap dragging across a thigh grips a
        // little instead of skating frictionlessly off it.
        prev[i].lerp(p, FRICTION)
      }
    }
  }

  /** No segment may exceed _maxLen. Runs whatever the solver managed — this is
   *  what keeps a bad frame from turning into an infinitely long strand. */
  _clamp() {
    const n = this.n
    const pos = this._pos
    const w = this._w
    const maxLen = this._maxLen
    if (!this.pinTip) {
      // Only the root is pinned, so a single outward sweep is EXACT: each
      // segment is fixed by moving its outer particle, and the outer particle of
      // one segment is the inner particle of the next, so nothing gets undone.
      for (let i = 0; i < n - 1; i++) {
        if (w[i + 1] === 0) continue
        const pa = pos[i]
        const pb = pos[i + 1]
        const dx = pb.x - pa.x
        const dy = pb.y - pa.y
        const dz = pb.z - pa.z
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (d > maxLen && d > 1e-9) {
          const s = maxLen / d
          pb.set(pa.x + dx * s, pa.y + dy * s, pa.z + dz * s)
        }
      }
    } else {
      // Both ends pinned: no sweep direction is exact, because fixing a segment
      // near one end re-breaks one near the other. Alternate direction and share
      // each correction between the two particles — that converges in a couple
      // of passes instead of ping-ponging. (A configuration whose two pins are
      // further apart than the chain can possibly reach is infeasible by
      // construction; the pass cap is what stops us spinning on it.)
      for (let pass = 0; pass < 8; pass++) {
        let moved = false
        for (let s = 0; s < n - 1; s++) {
          const i = (pass & 1) === 0 ? s : n - 2 - s
          const wa = w[i]
          const wb = w[i + 1]
          const ws = wa + wb
          if (ws <= 0) continue
          const pa = pos[i]
          const pb = pos[i + 1]
          const dx = pb.x - pa.x
          const dy = pb.y - pa.y
          const dz = pb.z - pa.z
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (d > maxLen && d > 1e-9) {
            const ex = (d - maxLen) / d / ws
            const sa = ex * wa
            const sb = ex * wb
            pa.set(pa.x + dx * sa, pa.y + dy * sa, pa.z + dz * sa)
            pb.set(pb.x - dx * sb, pb.y - dy * sb, pb.z - dz * sb)
            moved = true
          }
        }
        if (!moved) break
      }
    }
  }

  /** True if any particle has gone non-finite. Cheap enough to poll each frame. */
  isFinite() {
    const tip = this._pos[this.n - 1]
    return Number.isFinite(tip.x) && Number.isFinite(tip.y) && Number.isFinite(tip.z)
  }
}

const _inv = new THREE.Matrix4()
function _tmpInverse(obj) {
  return _inv.copy(obj.matrixWorld).invert()
}

// ===========================================================================
// ClothPatch — a Verlet grid. Cape, loincloth, banner, tabard.
// Row 0 is pinned to bones; everything below it falls.
// ===========================================================================
export class ClothPatch {
  constructor(o) {
    const opts = o || {}
    this.width = opts.width > 0 ? opts.width : 0.4
    this.height = opts.height > 0 ? opts.height : 0.5
    this.cols = Math.max(2, Math.round(opts.cols || 10))
    this.rows = Math.max(2, Math.round(opts.rows || 10))
    this.pins = (opts.pins || []).slice().sort((a, b) => a.col - b.col)

    this.mass = opts.mass > 0 ? opts.mass : 1
    this.stiffness = clamp01(opts.stiffness === undefined ? 0.9 : opts.stiffness)
    this.damping = clamp(opts.damping === undefined ? 0.04 : opts.damping, 0, 0.999)
    this.gravity = opts.gravity === undefined ? -9.8 : opts.gravity
    this.wind = clamp01(opts.wind === undefined ? 0.5 : opts.wind)
    this.drag = Math.max(0, opts.drag === undefined ? 0.02 : opts.drag)
    this.tearable = !!opts.tearable
    this._gravitySet = opts.gravity !== undefined

    const cols = this.cols
    const rows = this.rows
    const count = cols * rows
    this.count = count
    this._invMass = 1 / this.mass

    this._dx = this.width / (cols - 1)
    this._dy = this.height / (rows - 1)

    this._pos = new Float64Array(count * 3)
    this._prev = new Float64Array(count * 3)
    this._w = new Float32Array(count)
    this._out = new Float32Array(count * 3) // render mirror, float32
    this._nrm = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) this._w[i] = i < cols ? 0 : 1

    // --- constraint set: structural + shear, plus a separate UNILATERAL bend
    // set (skip-one links that resist compression only, never extension).
    // Bidirectional bend links make cloth behave like sheet metal; without any
    // bend term at all a patch whose pinned edge is narrower than its rest width
    // has nothing to push back against buckling and screws itself into a rag.
    // Resisting compression alone is the useful half: broad folds, no crumple,
    // and draping is still completely free.
    const ia = []
    const ib = []
    const rl = []
    const ba = []
    const bb = []
    const brl = []
    const idx = (c, r) => r * cols + c
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c + 1 < cols) {
          ia.push(idx(c, r))
          ib.push(idx(c + 1, r))
          rl.push(this._dx)
        }
        if (r + 1 < rows) {
          ia.push(idx(c, r))
          ib.push(idx(c, r + 1))
          rl.push(this._dy)
        }
        if (c + 1 < cols && r + 1 < rows) {
          const diag = Math.hypot(this._dx, this._dy)
          ia.push(idx(c, r))
          ib.push(idx(c + 1, r + 1))
          rl.push(diag)
          ia.push(idx(c + 1, r))
          ib.push(idx(c, r + 1))
          rl.push(diag)
        }
        if (c + 2 < cols) {
          ba.push(idx(c, r))
          bb.push(idx(c + 2, r))
          brl.push(this._dx * 2)
        }
        if (r + 2 < rows) {
          ba.push(idx(c, r))
          bb.push(idx(c, r + 2))
          brl.push(this._dy * 2)
        }
      }
    }
    this._ba = Int32Array.from(ba)
    this._bb = Int32Array.from(bb)
    this._brest = Float32Array.from(brl)
    this._kBend = 0.3 * this.stiffness
    this._ca = Int32Array.from(ia)
    this._cb = Int32Array.from(ib)
    this._crest = Float32Array.from(rl)
    this._cactive = new Uint8Array(this._ca.length).fill(1)
    this._ctear = new Float32Array(this._ca.length)
    this._links = new Uint8Array(count) // active link count, to cap tearing

    const rng = makeRng((opts.seed | 0) || 0x1e5 + cols * 7919 + rows * 104729)
    for (let i = 0; i < this._ctear.length; i++) {
      // Per-link strength variation, deterministic — a cape that tears along a
      // perfectly straight line looks manufactured.
      this._ctear[i] = 2.0 + rng() * 1.4
    }
    this._nx = rng() * 64
    this._ny = rng() * 64
    this._nz = rng() * 64

    this._iters = clamp(Math.round(1 + this.stiffness * 2), 1, 3)
    this._k = 0.4 + 0.6 * this.stiffness
    this._maxStretch = MAX_STRETCH
    // Same CFL guards as Strand — see the note there.
    const cell = Math.min(this._dx, this._dy)
    this._maxMove = cell * 2
    this._maxPush = cell * 1.2

    this._pinW = new Float64Array(Math.max(1, this.pins.length) * 3)
    this._row0Prev = new Float64Array(cols * 3)
    this._row0Tgt = new Float64Array(cols * 3)
    this._colTurb = new Float64Array(cols * 3)

    this.windVector = new THREE.Vector3()
    this._t = 0
    this._prevDt = 0
    this._subAlpha = 1
    this._settle = 8

    this.reset()
  }

  get positions() {
    return this._out
  }

  /** Per-particle normals, world space. Shared with ClothMesh so it never has to
   *  recompute them (and so nothing allocates during sync). */
  get normals() {
    return this._nrm
  }

  /** Resolve every pin's world position into _pinW. */
  _readPins() {
    const pins = this.pins
    for (let i = 0; i < pins.length; i++) {
      const pin = pins[i]
      const bone = pin.bone
      _k0.copy(pin.local)
      if (bone) {
        bone.updateWorldMatrix(true, false)
        _k0.applyMatrix4(bone.matrixWorld)
      }
      this._pinW[i * 3] = _k0.x
      this._pinW[i * 3 + 1] = _k0.y
      this._pinW[i * 3 + 2] = _k0.z
    }
  }

  /** Write the driven row-0 world positions for this frame into `out`. */
  _row0Target(out) {
    const pins = this.pins
    const cols = this.cols
    if (pins.length === 0) {
      for (let c = 0; c < cols; c++) {
        out[c * 3] = (c / (cols - 1) - 0.5) * this.width
        out[c * 3 + 1] = 0
        out[c * 3 + 2] = 0
      }
      return
    }
    if (pins.length === 1) {
      for (let c = 0; c < cols; c++) {
        // One pin can't define a width, so fan the edge out along world X.
        out[c * 3] = this._pinW[0] + (c / (cols - 1) - 0.5) * this.width
        out[c * 3 + 1] = this._pinW[1]
        out[c * 3 + 2] = this._pinW[2]
      }
      return
    }
    let seg = 0
    for (let c = 0; c < cols; c++) {
      while (seg < pins.length - 2 && pins[seg + 1].col < c) seg++
      const c0 = pins[seg].col
      const c1 = pins[seg + 1].col
      const span = c1 - c0
      // Columns outside the pinned span extrapolate along the same edge, which
      // keeps a cape's corners past the shoulder pins from bunching up.
      const u = Math.abs(span) < 1e-6 ? 0 : (c - c0) / span
      const o0 = seg * 3
      const o1 = (seg + 1) * 3
      out[c * 3] = this._pinW[o0] + (this._pinW[o1] - this._pinW[o0]) * u
      out[c * 3 + 1] = this._pinW[o0 + 1] + (this._pinW[o1 + 1] - this._pinW[o0 + 1]) * u
      out[c * 3 + 2] = this._pinW[o0 + 2] + (this._pinW[o1 + 2] - this._pinW[o0 + 2]) * u
    }
  }

  reset() {
    const cols = this.cols
    const rows = this.rows
    const pos = this._pos
    this._readPins()
    this._row0Target(this._row0Prev)

    // Edge tangent → a "back" direction, used to bias the hang so the patch
    // doesn't start as a perfectly flat sheet (which has no preferred fold and
    // buckles into a symmetric mess on the first gust).
    _k0.set(
      this._row0Prev[(cols - 1) * 3] - this._row0Prev[0],
      this._row0Prev[(cols - 1) * 3 + 1] - this._row0Prev[1],
      this._row0Prev[(cols - 1) * 3 + 2] - this._row0Prev[2],
    )
    if (_k0.lengthSq() < 1e-12) _k0.set(1, 0, 0)
    _k0.normalize().cross(UP)
    if (_k0.lengthSq() < 1e-12) _k0.set(0, 0, 1)
    _k0.normalize()

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i3 = (r * cols + c) * 3
        pos[i3] = this._row0Prev[c * 3] + _k0.x * this._dy * 0.06 * r
        pos[i3 + 1] = this._row0Prev[c * 3 + 1] - this._dy * r
        pos[i3 + 2] = this._row0Prev[c * 3 + 2] + _k0.z * this._dy * 0.06 * r
      }
    }
    this._prev.set(pos)
    this._cactive.fill(1)
    this._prevDt = 0
    this._t = 0
    this._settle = 8
    this._computeNormals()
    this._publish()
  }

  step(dt, colliders, accel) {
    const alpha = this._subAlpha
    this._subAlpha = 1
    if (!(dt > 0)) return
    this._t += dt

    const cols = this.cols
    const count = this.count
    const pos = this._pos
    const prev = this._prev
    const w = this._w

    // --- pinned edge: driven straight from the bones, sub-stepped ------------
    this._readPins()
    this._readRow0Into(pos, prev, alpha)

    // --- turbulence, one sample per column ----------------------------------
    if (this.wind > 0) {
      const f = 0.6
      const tt = this._t * 0.6
      for (let c = 0; c < cols; c++) {
        const i3 = c * 3
        const bx = pos[i3] * f + this._nx
        const by = pos[i3 + 1] * f + this._ny
        const bz = pos[i3 + 2] * f + this._nz
        this._colTurb[i3] = noise3(bx + tt, by, bz) * 2 - 1
        this._colTurb[i3 + 1] = (noise3(bx, by + tt, bz + 11.3) * 2 - 1) * 0.6
        this._colTurb[i3 + 2] = noise3(bx, by, bz + tt + 7.7) * 2 - 1
      }
    }

    // --- integrate -----------------------------------------------------------
    const damp = Math.pow(1 - this.damping, dt)
    const invPrev = this._prevDt > 1e-8 ? 1 / this._prevDt : 1 / dt
    const g = this.gravity
    const im = this._invMass
    const ax0 = accel ? -accel.x : 0
    const ay0 = accel ? -accel.y + g : g
    const az0 = accel ? -accel.z : 0
    const windK = this.wind > 0 ? this.wind * CLOTH_WIND_K * im : 0
    const tanK = windK * 0.15
    const dragK = this.drag * im
    const dragCap = 0.9 / dt
    const nrm = this._nrm
    const turb = this._colTurb
    const hasWind = windK > 0

    const maxMove = this._maxMove
    for (let i = cols; i < count; i++) {
      if (w[i] === 0) continue
      const i3 = i * 3
      let vx = (pos[i3] - prev[i3]) * invPrev
      let vy = (pos[i3 + 1] - prev[i3 + 1]) * invPrev
      let vz = (pos[i3 + 2] - prev[i3 + 2]) * invPrev
      const sp2 = vx * vx + vy * vy + vz * vz
      if (sp2 > MAX_SPEED * MAX_SPEED) {
        const s = MAX_SPEED / Math.sqrt(sp2)
        vx *= s
        vy *= s
        vz *= s
      }

      let ax = ax0
      let ay = ay0
      let az = az0

      if (hasWind) {
        const c3 = (i % cols) * 3
        const rx = this.windVector.x + turb[c3] * 1.6 - vx
        const ry = this.windVector.y + turb[c3 + 1] * 1.6 - vy
        const rz = this.windVector.z + turb[c3 + 2] * 1.6 - vz
        const nx = nrm[i3]
        const ny = nrm[i3 + 1]
        const nz = nrm[i3 + 2]
        // Pressure acts along the surface normal. That single term is what makes
        // cloth billow, luff and snap rather than just drift sideways.
        let s = nx * rx + ny * ry + nz * rz
        if (s > 12) s = 12
        else if (s < -12) s = -12
        ax += nx * s * windK + rx * tanK
        ay += ny * s * windK + ry * tanK
        az += nz * s * windK + rz * tanK
      }

      if (dragK > 0) {
        const sp = Math.hypot(vx, vy, vz)
        if (sp > 1e-6) {
          let k = dragK * sp
          if (k > dragCap) k = dragCap
          ax -= vx * k
          ay -= vy * k
          az -= vz * k
        }
      }

      let mx = vx * dt * damp + ax * dt * dt
      let my = vy * dt * damp + ay * dt * dt
      let mz = vz * dt * damp + az * dt * dt
      const m2 = mx * mx + my * my + mz * mz
      if (m2 > maxMove * maxMove) {
        const s = maxMove / Math.sqrt(m2)
        mx *= s
        my *= s
        mz *= s
      }
      prev[i3] = pos[i3]
      prev[i3 + 1] = pos[i3 + 1]
      prev[i3 + 2] = pos[i3 + 2]
      pos[i3] += mx
      pos[i3 + 1] += my
      pos[i3 + 2] += mz
    }

    // --- constraints ---------------------------------------------------------
    const ca = this._ca
    const cb = this._cb
    const crest = this._crest
    const active = this._cactive
    const kIter = this._k
    const nc = ca.length
    const ba = this._ba
    const bb = this._bb
    const brest = this._brest
    const nb = ba.length

    for (let it = 0; it < this._iters; it++) {
      for (let ci = 0; ci < nc; ci++) {
        if (active[ci] === 0) continue
        const a = ca[ci]
        const b = cb[ci]
        const wa = w[a]
        const wb = w[b]
        const ws = wa + wb
        if (ws <= 0) continue
        const a3 = a * 3
        const b3 = b * 3
        const dx = pos[b3] - pos[a3]
        const dy = pos[b3 + 1] - pos[a3 + 1]
        const dz = pos[b3 + 2] - pos[a3 + 2]
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 < 1e-16) continue // coincident: the shear links will separate them
        const d = Math.sqrt(d2)
        const rest = crest[ci]
        const diff = ((d - rest) / d) * kIter
        const sa = (diff * wa) / ws
        const sb = (diff * wb) / ws
        if (wa > 0) {
          pos[a3] += dx * sa
          pos[a3 + 1] += dy * sa
          pos[a3 + 2] += dz * sa
        }
        if (wb > 0) {
          pos[b3] -= dx * sb
          pos[b3 + 1] -= dy * sb
          pos[b3 + 2] -= dz * sb
        }
      }

      // Unilateral bend: push apart only. A pair two cells apart that has
      // closed up is a buckle; one that has opened up is just the sheet lying
      // flat, and pulling that back in would stiffen the whole cape.
      const kBend = this._kBend
      if (kBend > 0) {
        for (let bi = 0; bi < nb; bi++) {
          const a = ba[bi]
          const b = bb[bi]
          const wa = w[a]
          const wb = w[b]
          const ws = wa + wb
          if (ws <= 0) continue
          const a3 = a * 3
          const b3 = b * 3
          const dx = pos[b3] - pos[a3]
          const dy = pos[b3 + 1] - pos[a3 + 1]
          const dz = pos[b3 + 2] - pos[a3 + 2]
          const d2 = dx * dx + dy * dy + dz * dz
          if (d2 < 1e-16) continue
          const rest = brest[bi]
          if (d2 >= rest * rest) continue
          const d = Math.sqrt(d2)
          const diff = ((d - rest) / d) * kBend
          const sa = (diff * wa) / ws
          const sb = (diff * wb) / ws
          if (wa > 0) {
            pos[a3] += dx * sa
            pos[a3 + 1] += dy * sa
            pos[a3 + 2] += dz * sa
          }
          if (wb > 0) {
            pos[b3] -= dx * sb
            pos[b3 + 1] -= dy * sb
            pos[b3 + 2] -= dz * sb
          }
        }
      }

      // Collisions inside the relaxation loop — same reasoning as Strand: the
      // remaining iterations get to spread a collider's push across the sheet
      // instead of leaving one cell stretched by a whole capsule radius.
      this._collide(colliders)
    }

    // Tearing is suppressed for a few steps after reset(). The first pose after
    // a teleport snaps the pinned edge across the world while the rest of the
    // sheet is still at the old one; that is a bookkeeping artefact, not a
    // force, and without this guard it shreds the cape before frame one.
    if (this.tearable && this._settle === 0) this._tear()
    else if (this._settle > 0) this._settle--

    // --- contact & the last-resort projection -------------------------------
    // Sandwiched exactly like Strand: clamp, collide, clamp.
    this._clampLinks()
    this._collide(colliders)
    this._clampLinks()

    this._prevDt = dt
    this._computeNormals()
    this._publish()
  }

  /** Push every free particle out of every collider. Capped — see _maxPush. */
  _collide(colliders) {
    if (!colliders) return
    const cols = this.cols
    const count = this.count
    const pos = this._pos
    const prev = this._prev
    const w = this._w
    const maxPush = this._maxPush
    for (let c = 0; c < colliders.length; c++) {
      const col = colliders[c]
      for (let i = cols; i < count; i++) {
        if (w[i] === 0) continue
        const i3 = i * 3
        const ox = pos[i3]
        const oy = pos[i3 + 1]
        const oz = pos[i3 + 2]
        _k0.set(ox, oy, oz)
        if (!col.resolve(_k0, COLLIDE_PAD)) continue
        let mx = _k0.x - ox
        let my = _k0.y - oy
        let mz = _k0.z - oz
        const m2 = mx * mx + my * my + mz * mz
        if (m2 > maxPush * maxPush) {
          const s = maxPush / Math.sqrt(m2)
          mx *= s
          my *= s
          mz *= s
        }
        pos[i3] = ox + mx
        pos[i3 + 1] = oy + my
        pos[i3 + 2] = oz + mz
        prev[i3] += (pos[i3] - prev[i3]) * FRICTION
        prev[i3 + 1] += (pos[i3 + 1] - prev[i3 + 1]) * FRICTION
        prev[i3 + 2] += (pos[i3 + 2] - prev[i3 + 2]) * FRICTION
      }
    }
  }

  /** No live link may exceed 1.5x its rest length. Alternating sweeps: a grid's
   *  links conflict with each other, so a single Gauss-Seidel pass leaves a
   *  residue that the reverse pass mops up. */
  _clampLinks() {
    const pos = this._pos
    const w = this._w
    const ca = this._ca
    const cb = this._cb
    const crest = this._crest
    const active = this._cactive
    const nc = ca.length
    const maxK = this._maxStretch
    for (let pass = 0; pass < 3; pass++) {
      for (let n = 0; n < nc; n++) {
        const ci = (pass & 1) === 0 ? n : nc - 1 - n
        if (active[ci] === 0) continue
        const a = ca[ci]
        const b = cb[ci]
        const wa = w[a]
        const wb = w[b]
        const ws = wa + wb
        if (ws <= 0) continue
        const a3 = a * 3
        const b3 = b * 3
        const dx = pos[b3] - pos[a3]
        const dy = pos[b3 + 1] - pos[a3 + 1]
        const dz = pos[b3 + 2] - pos[a3 + 2]
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const max = crest[ci] * maxK
        if (d > max && d > 1e-9) {
          const excess = (d - max) / d / ws
          const sa = excess * wa
          const sb = excess * wb
          pos[a3] += dx * sa
          pos[a3 + 1] += dy * sa
          pos[a3 + 2] += dz * sa
          pos[b3] -= dx * sb
          pos[b3 + 1] -= dy * sb
          pos[b3 + 2] -= dz * sb
        }
      }
    }
  }

  /** Drive row 0 from the pins, sub-stepped like a strand root. `_row0Prev`
   *  holds where the edge landed last frame; alpha < 1 walks toward this
   *  frame's target instead of teleporting on the first substep. */
  _readRow0Into(pos, prev, alpha) {
    const cols = this.cols
    const tgt = this._row0Tgt
    this._row0Target(tgt)
    for (let c = 0; c < cols; c++) {
      const c3 = c * 3
      prev[c3] = pos[c3]
      prev[c3 + 1] = pos[c3 + 1]
      prev[c3 + 2] = pos[c3 + 2]
      if (alpha >= 1) {
        pos[c3] = tgt[c3]
        pos[c3 + 1] = tgt[c3 + 1]
        pos[c3 + 2] = tgt[c3 + 2]
        this._row0Prev[c3] = tgt[c3]
        this._row0Prev[c3 + 1] = tgt[c3 + 1]
        this._row0Prev[c3 + 2] = tgt[c3 + 2]
      } else {
        pos[c3] = this._row0Prev[c3] + (tgt[c3] - this._row0Prev[c3]) * alpha
        pos[c3 + 1] = this._row0Prev[c3 + 1] + (tgt[c3 + 1] - this._row0Prev[c3 + 1]) * alpha
        pos[c3 + 2] = this._row0Prev[c3 + 2] + (tgt[c3 + 2] - this._row0Prev[c3 + 2]) * alpha
      }
    }
  }

  /** Break links that are stretched past their (per-link, seeded) limit. */
  _tear() {
    const ca = this._ca
    const cb = this._cb
    const crest = this._crest
    const active = this._cactive
    const tear = this._ctear
    const links = this._links
    const pos = this._pos

    links.fill(0)
    for (let ci = 0; ci < ca.length; ci++) {
      if (active[ci] === 0) continue
      links[ca[ci]]++
      links[cb[ci]]++
    }
    for (let ci = 0; ci < ca.length; ci++) {
      if (active[ci] === 0) continue
      const a = ca[ci]
      const b = cb[ci]
      // Never orphan a particle: below three links it is barely held at all, and
      // a free-floating vertex renders as a spike shooting off the cape.
      if (links[a] <= 3 || links[b] <= 3) continue
      const a3 = a * 3
      const b3 = b * 3
      const dx = pos[b3] - pos[a3]
      const dy = pos[b3 + 1] - pos[a3 + 1]
      const dz = pos[b3 + 2] - pos[a3 + 2]
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d > crest[ci] * tear[ci]) {
        active[ci] = 0
        links[a]--
        links[b]--
      }
    }
  }

  /** Grid normals from finite differences. Also feeds the wind model. */
  _computeNormals() {
    const cols = this.cols
    const rows = this.rows
    const pos = this._pos
    const nrm = this._nrm
    for (let r = 0; r < rows; r++) {
      const rm = r > 0 ? r - 1 : r
      const rp = r < rows - 1 ? r + 1 : r
      for (let c = 0; c < cols; c++) {
        const cm = c > 0 ? c - 1 : c
        const cp = c < cols - 1 ? c + 1 : c
        const iL = (r * cols + cm) * 3
        const iR = (r * cols + cp) * 3
        const iU = (rm * cols + c) * 3
        const iD = (rp * cols + c) * 3
        const ux = pos[iR] - pos[iL]
        const uy = pos[iR + 1] - pos[iL + 1]
        const uz = pos[iR + 2] - pos[iL + 2]
        const vx = pos[iD] - pos[iU]
        const vy = pos[iD + 1] - pos[iU + 1]
        const vz = pos[iD + 2] - pos[iU + 2]
        let nx = uy * vz - uz * vy
        let ny = uz * vx - ux * vz
        let nz = ux * vy - uy * vx
        const l = Math.sqrt(nx * nx + ny * ny + nz * nz)
        const i3 = (r * cols + c) * 3
        if (l > 1e-12) {
          const inv = 1 / l
          nx *= inv
          ny *= inv
          nz *= inv
        } else {
          // Degenerate patch (fully collapsed cell). Any unit vector beats NaN.
          nx = 0
          ny = 0
          nz = 1
        }
        nrm[i3] = nx
        nrm[i3 + 1] = ny
        nrm[i3 + 2] = nz
      }
    }
  }

  /** Mirror the float64 solver state into the float32 render buffer. */
  _publish() {
    const out = this._out
    const pos = this._pos
    for (let i = 0; i < out.length; i++) out[i] = pos[i]
  }

  isFinite() {
    const pos = this._pos
    const last = pos.length - 3
    return Number.isFinite(pos[last]) && Number.isFinite(pos[last + 1]) && Number.isFinite(pos[last + 2])
  }
}

// ===========================================================================
// StrandMesh — a swept tube around a Strand, rebuilt every frame.
// ===========================================================================
export class StrandMesh extends THREE.Mesh {
  constructor(strand, opts) {
    const o = opts || {}
    const n = strand.points.length
    const rs = Math.max(3, Math.round(o.radialSegments === undefined ? 5 : o.radialSegments))
    const ringVerts = n * rs
    const vertCount = ringVerts + 2 // + one centre vertex per end cap
    const triCount = (n - 1) * rs * 2 + rs * 2

    const position = new Float32Array(vertCount * 3)
    const normal = new Float32Array(vertCount * 3)
    const uv = new Float32Array(vertCount * 2)
    const IndexArray = vertCount > 65535 ? Uint32Array : Uint16Array
    const index = new IndexArray(triCount * 3)

    let t = 0
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < rs; j++) {
        const j2 = (j + 1) % rs
        const a = i * rs + j
        const b = i * rs + j2
        const c = (i + 1) * rs + j
        const d = (i + 1) * rs + j2
        index[t++] = a
        index[t++] = c
        index[t++] = b
        index[t++] = b
        index[t++] = c
        index[t++] = d
      }
    }
    const cap0 = ringVerts
    const cap1 = ringVerts + 1
    for (let j = 0; j < rs; j++) {
      const j2 = (j + 1) % rs
      index[t++] = cap0
      index[t++] = j2
      index[t++] = j
      index[t++] = cap1
      index[t++] = (n - 1) * rs + j
      index[t++] = (n - 1) * rs + j2
    }

    for (let i = 0; i < n; i++) {
      const v = i / (n - 1)
      for (let j = 0; j < rs; j++) {
        const k = (i * rs + j) * 2
        uv[k] = j / rs
        uv[k + 1] = v
      }
    }
    uv[cap0 * 2] = 0.5
    uv[cap1 * 2] = 0.5
    uv[cap1 * 2 + 1] = 1

    const geo = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(position, 3)
    const nrmAttr = new THREE.BufferAttribute(normal, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    nrmAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', posAttr)
    geo.setAttribute('normal', nrmAttr)
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    geo.setIndex(new THREE.BufferAttribute(index, 1))

    const ownsMaterial = !o.material
    super(geo, o.material || new THREE.MeshStandardMaterial({ color: 0x6b5a44, roughness: 0.85 }))

    this.strand = strand
    this.radialSegments = rs
    this.radius = o.radius === undefined ? 0.01 : o.radius
    this.taper = o.taper === undefined ? 1 : o.taper
    this._n = n
    this._ringVerts = ringVerts
    this._posAttr = posAttr
    this._nrmAttr = nrmAttr
    this._ownsMaterial = ownsMaterial
    // The geometry moves every frame, so a bounding sphere would have to be
    // recomputed every frame too. Cheaper to just never cull it.
    this.frustumCulled = false

    // Precomputed ring trig — the sweep is the same circle at every station.
    this._cos = new Float32Array(rs)
    this._sin = new Float32Array(rs)
    for (let j = 0; j < rs; j++) {
      const a = (j / rs) * Math.PI * 2
      this._cos[j] = Math.cos(a)
      this._sin[j] = Math.sin(a)
    }
    this._nrmRef = new THREE.Vector3()

    this.sync()
  }

  sync() {
    const pts = this.strand.points
    const n = this._n
    const rs = this.radialSegments
    const pos = this._posAttr.array
    const nrm = this._nrmAttr.array
    const cos = this._cos
    const sin = this._sin

    // Parallel-transport frames. Rotating the previous frame onto the new
    // tangent (rather than rebuilding it from a fixed up-vector) is what stops
    // the tube from spinning wildly where the strand passes through vertical.
    const ref = this._nrmRef
    let haveRef = false

    for (let i = 0; i < n; i++) {
      const p = pts[i]
      if (!Number.isFinite(p.x)) return // a broken sim must not corrupt the buffer

      // Tangent: central difference in the interior, one-sided at the ends.
      if (i === 0) _m0.subVectors(pts[1], pts[0])
      else if (i === n - 1) _m0.subVectors(pts[n - 1], pts[n - 2])
      else _m0.subVectors(pts[i + 1], pts[i - 1])
      if (_m0.lengthSq() < 1e-16) _m0.set(0, 1, 0)
      else _m0.normalize()

      if (!haveRef) {
        anyPerpendicular(_m0, ref)
        haveRef = true
      } else {
        _mq.setFromUnitVectors(_m1, _m0)
        ref.applyQuaternion(_mq)
        // Re-orthogonalize: quaternion drift over 10 stations is small, but it
        // accumulates over minutes of running and eventually skews the tube.
        ref.addScaledVector(_m0, -ref.dot(_m0))
        if (ref.lengthSq() < 1e-12) anyPerpendicular(_m0, ref)
        else ref.normalize()
      }
      _m1.copy(_m0)

      _m2.crossVectors(_m0, ref) // binormal
      const r = this.radius * (1 + (this.taper - 1) * (i / (n - 1)))

      for (let j = 0; j < rs; j++) {
        const nx = ref.x * cos[j] + _m2.x * sin[j]
        const ny = ref.y * cos[j] + _m2.y * sin[j]
        const nz = ref.z * cos[j] + _m2.z * sin[j]
        const k = (i * rs + j) * 3
        pos[k] = p.x + nx * r
        pos[k + 1] = p.y + ny * r
        pos[k + 2] = p.z + nz * r
        nrm[k] = nx
        nrm[k + 1] = ny
        nrm[k + 2] = nz
      }
    }

    // End caps.
    const c0 = this._ringVerts * 3
    const c1 = c0 + 3
    _m3.subVectors(pts[1], pts[0])
    if (_m3.lengthSq() < 1e-16) _m3.set(0, 1, 0)
    else _m3.normalize()
    pos[c0] = pts[0].x
    pos[c0 + 1] = pts[0].y
    pos[c0 + 2] = pts[0].z
    nrm[c0] = -_m3.x
    nrm[c0 + 1] = -_m3.y
    nrm[c0 + 2] = -_m3.z
    _m3.subVectors(pts[n - 1], pts[n - 2])
    if (_m3.lengthSq() < 1e-16) _m3.set(0, 1, 0)
    else _m3.normalize()
    pos[c1] = pts[n - 1].x
    pos[c1 + 1] = pts[n - 1].y
    pos[c1 + 2] = pts[n - 1].z
    nrm[c1] = _m3.x
    nrm[c1 + 1] = _m3.y
    nrm[c1 + 2] = _m3.z

    this._posAttr.needsUpdate = true
    this._nrmAttr.needsUpdate = true
  }

  dispose() {
    this.geometry.dispose()
    if (this._ownsMaterial) this.material.dispose()
  }
}

// ===========================================================================
// ClothMesh — a grid mesh over a ClothPatch. Shares the patch's buffers, so
// sync() is a pair of dirty flags rather than a copy.
// ===========================================================================
export class ClothMesh extends THREE.Mesh {
  constructor(cloth, opts) {
    const o = opts || {}
    const cols = cloth.cols
    const rows = cloth.rows
    const count = cols * rows

    const uv = new Float32Array(count * 2)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const k = (r * cols + c) * 2
        uv[k] = c / (cols - 1)
        uv[k + 1] = 1 - r / (rows - 1)
      }
    }
    const IndexArray = count > 65535 ? Uint32Array : Uint16Array
    const index = new IndexArray((cols - 1) * (rows - 1) * 6)
    let t = 0
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const a = r * cols + c
        const b = a + 1
        const d = a + cols
        const e = d + 1
        index[t++] = a
        index[t++] = d
        index[t++] = b
        index[t++] = b
        index[t++] = d
        index[t++] = e
      }
    }

    const geo = new THREE.BufferGeometry()
    // Wrap the patch's live arrays directly — no per-frame copy, and the solver
    // and the GPU are looking at exactly the same numbers.
    const posAttr = new THREE.BufferAttribute(cloth.positions, 3)
    const nrmAttr = new THREE.BufferAttribute(cloth.normals, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    nrmAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', posAttr)
    geo.setAttribute('normal', nrmAttr)
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    geo.setIndex(new THREE.BufferAttribute(index, 1))

    const ownsMaterial = !o.material
    const mat =
      o.material ||
      new THREE.MeshStandardMaterial({ color: 0x7a3b46, roughness: 0.92, side: THREE.DoubleSide })
    super(geo, mat)

    // A cape is a surface with no thickness; it has to be visible from behind.
    this.material.side = THREE.DoubleSide
    this.cloth = cloth
    this._posAttr = posAttr
    this._nrmAttr = nrmAttr
    this._ownsMaterial = ownsMaterial
    this.frustumCulled = false
  }

  sync() {
    this._posAttr.needsUpdate = true
    this._nrmAttr.needsUpdate = true
  }

  dispose() {
    this.geometry.dispose()
    if (this._ownsMaterial) this.material.dispose()
  }
}

// ===========================================================================
// DynamicsWorld — the one thing the app calls per frame.
// ===========================================================================
export class DynamicsWorld {
  constructor({ gravity = -9.8, substeps = 2, wind = 0.4, maxDt = 1 / 30 } = {}) {
    this.gravity = gravity
    this.substeps = clamp(Math.round(substeps) || 1, 1, 8)
    this.wind = wind
    this.maxDt = maxDt > 0 ? maxDt : 1 / 30

    this.colliders = []
    this.strands = []
    this.cloths = []
    this.meshes = []

    this.velocity = new THREE.Vector3()
    this.accel = new THREE.Vector3()

    this._vPrev = new THREE.Vector3()
    this._accelRaw = new THREE.Vector3()
    this._wind = new THREE.Vector3()
    this._time = 0
    this._frame = 0
  }

  addCollider(c) {
    if (c) this.colliders.push(c)
    return c
  }

  addStrand(s) {
    if (!s) return s
    // Adopt world gravity unless the strand asked for its own — lets a whole rig
    // be retuned (moon gravity, say) from one place.
    if (!s._gravitySet) s.gravity = this.gravity
    this.strands.push(s)
    return s
  }

  addCloth(c) {
    if (!c) return c
    if (!c._gravitySet) c.gravity = this.gravity
    this.cloths.push(c)
    return c
  }

  addMesh(m) {
    if (m) this.meshes.push(m)
    return m
  }

  setCharacterVelocity(v3) {
    if (v3 && Number.isFinite(v3.x) && Number.isFinite(v3.y) && Number.isFinite(v3.z)) {
      this.velocity.copy(v3)
    }
    return this
  }

  step(dt) {
    // Guard the clock first. A backgrounded tab hands back a dt of several
    // seconds; integrating that in one go is how sims die. Clamping to maxDt
    // means the worst case is the kit running briefly in slow motion.
    if (!Number.isFinite(dt) || dt <= 0) {
      this._updateColliders()
      this._syncMeshes()
      return
    }
    if (dt > this.maxDt) dt = this.maxDt

    this._time += dt
    this._frame++

    // --- character acceleration ---------------------------------------------
    this._accelRaw.subVectors(this.velocity, this._vPrev).multiplyScalar(1 / dt)
    const am = this._accelRaw.length()
    if (!Number.isFinite(am)) this._accelRaw.set(0, 0, 0)
    else if (am > MAX_ACCEL) this._accelRaw.multiplyScalar(MAX_ACCEL / am)
    // Low-pass, ~70ms time constant: keeps a single hitched frame from cracking
    // every strap like a whip, without muting a real lunge.
    this.accel.lerp(this._accelRaw, 1 - Math.pow(1e-6, dt))
    this._vPrev.copy(this.velocity)

    // --- wind field ----------------------------------------------------------
    // Ambient breeze wanders on noise so nothing ever settles into dead-still,
    // then the character's own velocity is subtracted: running into calm air is
    // physically identical to standing in a headwind, and that's what streams
    // the cape backwards for free.
    const t = this._time * 0.12
    _w0.set(
      noise3(t, 0.3, 0.7) * 2 - 1,
      (noise3(0.9, t, 2.1) * 2 - 1) * 0.35,
      noise3(4.2, 1.5, t) * 2 - 1,
    )
    _w0.multiplyScalar(this.wind * AMBIENT_WIND)
    _w0.addScaledVector(this.velocity, -APPARENT_WIND)
    this._wind.copy(_w0)

    const strands = this.strands
    const cloths = this.cloths
    for (let i = 0; i < strands.length; i++) strands[i].windVector.copy(this._wind)
    for (let i = 0; i < cloths.length; i++) cloths[i].windVector.copy(this._wind)

    // --- solve ---------------------------------------------------------------
    this._updateColliders()

    const sub = this.substeps
    const h = dt / sub
    for (let s = 0; s < sub; s++) {
      // Alpha tells each solver how far through this frame's anchor motion it
      // is, so a fast bone's displacement is delivered smoothly instead of
      // dumped into the first substep.
      const alpha = (s + 1) / sub
      for (let i = 0; i < strands.length; i++) {
        strands[i]._subAlpha = alpha
        strands[i].step(h, this.colliders, this.accel)
      }
      for (let i = 0; i < cloths.length; i++) {
        cloths[i]._subAlpha = alpha
        cloths[i].step(h, this.colliders, this.accel)
      }
    }

    // --- health check --------------------------------------------------------
    // One finite-check per object per frame. If anything has gone non-finite
    // (a degenerate bone matrix, a NaN fed in from animation) snap it back to
    // rest rather than letting the corruption spread into the vertex buffers.
    for (let i = 0; i < strands.length; i++) if (!strands[i].isFinite()) strands[i].reset()
    for (let i = 0; i < cloths.length; i++) if (!cloths[i].isFinite()) cloths[i].reset()

    this._syncMeshes()
  }

  _updateColliders() {
    const cols = this.colliders
    for (let i = 0; i < cols.length; i++) cols[i].update()
  }

  _syncMeshes() {
    const meshes = this.meshes
    for (let i = 0; i < meshes.length; i++) meshes[i].sync()
  }

  reset() {
    this._updateColliders()
    for (let i = 0; i < this.strands.length; i++) this.strands[i].reset()
    for (let i = 0; i < this.cloths.length; i++) this.cloths[i].reset()
    this.velocity.set(0, 0, 0)
    this._vPrev.set(0, 0, 0)
    this.accel.set(0, 0, 0)
    this._time = 0
    this._frame = 0
    this._syncMeshes()
  }

  dispose() {
    for (let i = 0; i < this.meshes.length; i++) {
      const m = this.meshes[i]
      if (m.dispose) m.dispose()
      if (m.parent) m.parent.remove(m)
    }
    this.meshes.length = 0
    this.strands.length = 0
    this.cloths.length = 0
    this.colliders.length = 0
  }
}
