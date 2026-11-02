// paper.js — pop-up mechanisms posed from a dihedral angle.
//
// ─── THE IDEA ────────────────────────────────────────────────────────────────
// A HINGE is two flat panels sharing a crease, meeting at dihedral angle θ. The
// book's spine is the root hinge (`paper.root`, θ = how far the spread is open).
// Every mechanism is built ON a hinge, rises into the wedge between its panels
// (toward the hinge's +y), and yields new panels and hinges to build on. You
// never pose anything yourself: the engine calls `paper.update(θ)` each frame
// and every mechanism re-poses, in creation order, from its parent's current θ.
// Glue things to the frames below (or use card()/place()) and they ride along.
//
// ─── HINGE FRAME  (hinge.crease — for the root, the spread group itself) ─────
//
//                        +y   the bisector: mechanisms rise this way
//                         ^
//          left panel     |     right panel      uL = (−sin θ/2, cos θ/2, 0)
//          (dir −1)  uL \ |θ/ uR  (dir +1)       uR = ( sin θ/2, cos θ/2, 0)
//                        \|/
//         −x ─────────────o───────────── +x      o = the crease, running along +z
//                     +z: out of the screen      (toward the reader, for the root)
//
//   θ = π  open flat: pages along ±x, +y straight up.
//   θ = 0  closed: both panels along +y — everything built on the hinge lies
//          flat in its x = 0 plane. θ may exceed π on an *outside* hinge.
//
// ─── PANEL FRAME  (hinge.left/right, fold.left/right, flap.panel) ────────────
//   origin on the panel's glue line; +z along that line; +y the panel normal on
//   the face that looks toward the parent hinge's +y side (pages: up; folds: the
//   OUTSIDE faces); +x = y × z. The body lies where x·dir ≥ 0, with
//   `frame.userData.dir` = ±1 and `frame.userData.length` = extent from the
//   glue line. card() and place() handle dir — distances you pass are positive.
//   paper.root.right: dir +1 (+x runs out along the page), root.left: dir −1.
//
// ─── PARALLEL FOLD  (a profile in the hinge's xy plane, extruded z0..z1) ─────
//
//                       ^ fold.ridge: +y out of the fold (== fold.outer.crease)
//                       C
//                  p  /   \  q
//      fold.left    /  inner  \    fold.right
//                 /  +y down v  \
//   ============●=======o=======●============  pages at θ = π
//              a·uL   spine    b·uR
//
//   Glued a and b from the hinge crease; C is where the circles of radius p
//   about a·uL and q about b·uR meet, on the hinge's +y side.
//   Folds flat at θ = 0 when a + p = b + q (the crease then lies a + p from the
//   spine when closed); rises when open if p + q > a + b (p + q = a + b lies
//   flat when open). Other inputs still pose without NaN, just not flat.
//   Built on an OUTSIDE hinge (fold.outer) the flat rule is p − a = q − b: the
//   folded piece then sticks out p − a beyond the parent's crease.
//
// ─── V-FOLD ─────────────────────────────────────────────────────────────────
//   Glue lines start at an apex on the crease axis (hinge z = `z`) and run at
//   `alpha` from the axis into each panel, toward −z ('far') or +z ('near').
//   The piece's crease rises in the x = 0 plane; `gamma` is the paper's cut angle
//   between glue edge and crease (alpha < gamma ≤ π/2; gamma = π/2 stands the
//   crease straight up when open). V panel frames: origin at the apex, +z out
//   along the glue line, body toward the crease, +y the outside face.
//   In a V panel's own coords (s toward the crease, t along the glue line):
//        crease end K = (length·sin γ, length·cos γ)
//        'tri'  = apex (0,0) · glue end (0,w) · K                      (default)
//        'quad' = apex · glue end (0,w) · (K.s, w + K.t) · K   — a parallelogram:
//                 glue edge w, crease edge `length`, outer edge ∥ the crease
//                 (at distance w·sin γ from it). w = card's `z1`, default length.
//
// ─── LEFT / RIGHT IN NESTED HINGES — read before building on a fold ─────────
//   Every frame is right-handed and parallel folds keep the parent's +z, so z0,
//   z1 and z mean the same in a nested mechanism as in its parent. Consequences:
//   • fold.outer (+y out, same pose as fold.ridge): outer.left / outer.right
//     ARE the fold's physical left / right panels — as you'd expect.
//   • fold.inner (+y into the fold — DOWN for a tent) is seen from inside,
//     upside down: inner.left is the physical RIGHT panel, inner.right the LEFT.
//     (A symmetric nested fold doesn't care.) θ_outer = 2π − θ_inner.
//   • V-folds: inner/ridge +z runs from the apex up the crease. 'far': inner's
//     left/right = the physical left/right panels; 'near': swapped. outer is
//     always the opposite of inner.
//   Hinge panel frames (hinge.left/right) start ON the crease with the body
//   running away from it, like pages from the spine; fold panel frames
//   (fold.left/right) start on the glue line with the body running TO the
//   crease. They are distinct objects: fold.left's +y faces out of the fold,
//   fold.inner.right's +y faces into it.
//
// ─── FLAPS ──────────────────────────────────────────────────────────────────
//   flap({ on, side }) hinges one panel on `on.left` / `on.right` (`on` = a hinge
//   or a fold) along a line `x` along the host's body from the host frame's
//   origin (pages: from the spine; fold panels: from their glue line), offset
//   `z`, rotated `alpha` about the host normal — positive swings the line's +z
//   end toward the host's body side, so equal settings on left and right
//   mirror. The flap body extends AWAY from the host origin and lifts by
//   lift(θ_on) radians toward the host's +y. The hinge sits 0.002 above the host
//   so a flat flap never z-fights. Default card: square, centred on the hinge.
//
// ─── CARDS ──────────────────────────────────────────────────────────────────
//   card(frame, { length, z0, z1, shape, material, thickness }) — 'rect' covers
//   s ∈ [0, length], t ∈ [z0, z1]; non-V 'tri' is a pennant with its base on the
//   glue line; a THREE.Shape is drawn in (s, t). UVs: u along the frame's +x,
//   v along its −z, 0..1 over the card (a texture reads upright looking at +y
//   with the frame's −z at the top — e.g. a page from above, far edge up).
//   thickness > 0 extrudes a slab centred on y = 0.
//
// ─── SHADOWS, STAND-OFFS — two things every author ran into ─────────────────
//   • The engine uses VSM shadows, and three.js draws every mesh that
//     *receives* shadows into a VSM shadow map too. So a translucent or glow
//     card with castShadow = false still throws a solid shadow unless
//     receiveShadow is false as well. card() turns both on: clear both for
//     water, veils, acetate, glows.
//   • The pages meet at the spine with no clearance, so anything held above a
//     page (a flap's 0.002 hinge gap, a decoration at y = 0.002) can show
//     through the other page near the gutter while the spread is nearly shut.
//     The engine hides a spread entirely under ~3° (CLOSED_THETA in book.js);
//     for the few degrees above that, sink printed layers toward the page as
//     θ → 0 and keep them a few mm off the spine.
//
// ─── THREE SNIPPETS ─────────────────────────────────────────────────────────
//   // 1. A tent 0.36 high, glued 0.35 from the spine, with a lamp on its ridge
//   const tent = paper.parallelFold({ a: 0.35, b: 0.35, p: 0.5, q: 0.5, z0: -0.3, z1: 0.1 })
//   paper.card(tent.left, { material: roof })
//   paper.card(tent.right, { material: roof })
//   paper.place(tent.ridge, { y: 0.02, z: -0.1 }).add(lamp)
//
//   // 2. A fan of V-fold rays stepping back and growing. Equal alpha/gamma keep
//   //    every ray's panels parallel at every θ, so they never cut each other.
//   for (let i = 0; i < 4; i++) {
//     const ray = paper.vFold({ z: 0.2 - 0.15 * i, alpha: 0.45, gamma: 1.25, length: 0.3 + 0.1 * i })
//     paper.card(ray.left, { material: gold })      // 'tri' by default
//     paper.card(ray.right, { material: gold })
//   }
//
//   // 3. A petal that opens with the page (must return 0 at θ = 0)
//   const petal = paper.flap({ side: 'right', x: 0.6, z: 0.2, alpha: 0.4, length: 0.25,
//                              lift: (th) => 1.1 * Math.sin(th / 2) ** 2 })
//   paper.card(petal.panel, { shape: 'tri', material: pink })

import * as THREE from 'three'

// What the root page frames advertise (mirrors W and H in src/book.js; kept
// local so the fold library has no engine dependency).
const PAGE_W = 1.0
const PAGE_H = 1.4
const FLAP_GAP = 0.002
const TINY = 1e-12
const HALF_PI = Math.PI / 2
const TAU = Math.PI * 2

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const finite = (v, fallback) => (Number.isFinite(v) ? v : fallback)

// Scratch space for posing. Posing is synchronous, so module-level scratch is
// safe and update() allocates nothing.
const _m = new THREE.Matrix4()
const _x = new THREE.Vector3()
const _y = new THREE.Vector3()
const _g = new THREE.Vector3()
const _c = new THREE.Vector3()

function setBasis(obj, x, y, z) {
  _m.makeBasis(x, y, z)
  obj.quaternion.setFromRotationMatrix(_m)
}

function frame(name, userData) {
  const o = new THREE.Object3D()
  o.name = name
  o.userData = userData
  return o
}

// Orient a V-fold panel frame. Expects the unit glue direction in _g and the
// unit crease direction in _c (both in the parent hinge frame). `side` is +1 for
// the panel on the hinge's right panel, −1 for the left; (sh, ch) = sin/cos θ/2.
function poseVPanel(panel, dir, side, sh, ch) {
  // +x: in the panel plane, ⊥ the glue line, toward the crease (times dir).
  _x.copy(_c).addScaledVector(_g, -_c.dot(_g))
  let l = _x.length()
  if (l < 1e-9) {
    // Crease along the glue line (degenerate input): fall back to the host
    // panel's own in-plane direction, then to anything ⊥ the glue line.
    _x.set(side * sh, ch, 0)
    _x.addScaledVector(_g, -_x.dot(_g))
    l = _x.length()
    if (l < 1e-9) {
      _x.set(0, 1, 0).addScaledVector(_g, -_g.y)
      l = _x.length()
    }
    if (l < 1e-9) {
      _x.set(1, 0, 0).addScaledVector(_g, -_g.x)
      l = _x.length()
    }
  }
  _x.multiplyScalar(dir / l)
  _y.crossVectors(_g, _x) // y = z × x
  setBasis(panel, _x, _y, _g)
}

// A crease seen as a hinge. The panel frames start on the crease (like pages
// from the spine): right body toward +x (dir +1), left toward −x (dir −1).
class Hinge {
  constructor(crease, getTheta, { name = 'hinge', leftLength = 1, rightLength = 1, z0 = -0.5, z1 = 0.5, outsideCrease = null } = {}) {
    this.crease = crease
    this._getTheta = getTheta
    this._name = name
    this._dims = { leftLength, rightLength, z0, z1 }
    this._outside = null
    this._outsideCrease = outsideCrease
    this.left = frame(`${name}.left`, { dir: -1, length: leftLength, z0, z1, kind: 'hinge' })
    this.right = frame(`${name}.right`, { dir: +1, length: rightLength, z0, z1, kind: 'hinge' })
    crease.add(this.left, this.right)
    this._poseFrames()
  }

  get theta() {
    return this._getTheta()
  }

  // The same crease rotated π about z: +y points out of the wedge, θ_out = 2π − θ.
  // Rotating about z swaps the physical panels: outside.left is this.right's
  // paper and outside.right is this.left's. outside.outside === this.
  get outside() {
    if (!this._outside) {
      let crease = this._outsideCrease
      if (!crease) {
        crease = new THREE.Object3D()
        crease.name = `${this._name}.outside`
        crease.rotation.z = Math.PI
        this.crease.add(crease)
      }
      const { leftLength, rightLength, z0, z1 } = this._dims
      const out = new Hinge(crease, () => TAU - this.theta, {
        name: `${this._name}.outside`,
        leftLength: rightLength,
        rightLength: leftLength,
        z0,
        z1,
      })
      out._outside = this
      this._outside = out
    }
    return this._outside
  }

  _poseFrames() {
    const h = this.theta * 0.5
    this.right.rotation.set(0, 0, HALF_PI - h)
    this.left.rotation.set(0, 0, h - HALF_PI)
  }

  _pose() {
    this._poseFrames()
    if (this._outside) this._outside._poseFrames()
  }
}

class Fold {
  constructor(left, right, ridge) {
    this.left = left
    this.right = right
    this.ridge = ridge
    this.inner = null
    this._theta = 0
    this._height = 0
  }
  get outer() {
    return this.inner.outside
  }
  get theta() {
    return this._theta
  }
  get height() {
    return this._height
  }
}

class Flap {
  constructor(panel) {
    this.panel = panel
    this._angle = 0
  }
  get angle() {
    return this._angle
  }
}

function materialKey(v) {
  if (v === null || v === undefined) return String(v)
  if (typeof v !== 'object') return `${typeof v}:${String(v)}`
  if (v.isColor) return `color:${v.getHexString()}`
  if (typeof v.uuid === 'string') return `uuid:${v.uuid}`
  if (Array.isArray(v)) return `[${v.map(materialKey).join(',')}]`
  return `{${Object.keys(v)
    .sort()
    .map((k) => `${k}=${materialKey(v[k])}`)
    .join(',')}}`
}

function hashSeed(seed) {
  if (typeof seed === 'string') {
    let h = 2166136261
    for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
    return h >>> 0
  }
  return Math.floor(finite(seed, 1)) >>> 0
}

// (u, v) coords of a planar card lie in [0, 1]: u along +x, v along −z.
function projectUVs(geometry) {
  geometry.computeBoundingBox()
  const { min, max } = geometry.boundingBox
  const sx = max.x - min.x || 1
  const sz = max.z - min.z || 1
  const pos = geometry.attributes.position
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[2 * i] = (pos.getX(i) - min.x) / sx
    uv[2 * i + 1] = (max.z - pos.getZ(i)) / sz
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
}

export class Paper {
  constructor(spreadGroup) {
    this.group = spreadGroup
    this._theta = Math.PI
    this._mechanisms = []
    this._materials = new Map()
    this._geometries = []
    this._count = 0
    // The spread group IS the root crease. Its panel frames are the pages.
    this.root = new Hinge(spreadGroup, () => this._theta, {
      name: 'paper.root',
      leftLength: PAGE_W,
      rightLength: PAGE_W,
      z0: -PAGE_H / 2,
      z1: PAGE_H / 2,
    })
    this.root.left.userData.kind = 'page'
    this.root.right.userData.kind = 'page'
  }

  // Engine: once per frame, before the scene's update(). Non-finite θ is ignored.
  update(theta) {
    if (Number.isFinite(theta)) this._theta = clamp(theta, 0, Math.PI)
    this.root._pose()
    const ms = this._mechanisms
    for (let i = 0; i < ms.length; i++) ms[i].pose()
  }

  // ---- mechanisms ---------------------------------------------------------

  // A piece creased parallel to the hinge: left panel (length p) glued to
  // on.left at distance a from the crease, right panel (length q) to on.right
  // at b. b defaults to a and q to p (a symmetric tent). Negative or non-finite
  // inputs are clamped; impossible ones (panels too short / too long) clamp the
  // crease onto the reachable circle instead of producing NaN.
  parallelFold({ on = this.root, a, b, p, q, z0 = -0.5, z1 = 0.5 } = {}) {
    a = Math.max(0, finite(a, 0.35))
    b = Math.max(0, finite(b, a))
    p = Math.max(0, finite(p, 0.5))
    q = Math.max(0, finite(q, p))
    z0 = finite(z0, -0.5)
    z1 = finite(z1, 0.5)
    const id = `paper.fold${++this._count}`
    const left = frame(`${id}.left`, { dir: +1, length: p, z0, z1, kind: 'parallel' })
    const right = frame(`${id}.right`, { dir: -1, length: q, z0, z1, kind: 'parallel' })
    const crease = frame(`${id}.inner`, {})
    const ridge = frame(`${id}.ridge`, {})
    on.crease.add(left, right, crease, ridge)
    const fold = new Fold(left, right, ridge)
    // inner +x points at the physical LEFT panel (see the header), so the
    // inner hinge's right panel is p long and its left panel q long.
    fold.inner = new Hinge(crease, () => fold._theta, {
      name: `${id}.inner`,
      leftLength: q,
      rightLength: p,
      z0,
      z1,
      outsideCrease: ridge,
    })
    const pp = p * p
    const qq = q * q

    const pose = () => {
      const h = on.theta * 0.5
      const sh = Math.sin(h)
      const ch = Math.cos(h)
      const glx = -a * sh
      const gly = a * ch
      const grx = b * sh
      const gry = b * ch
      // Unit chord GL → GR; at d = 0 (a = b, θ = 0) use its limit, +x.
      const dx = grx - glx
      const dy = gry - gly
      const d = Math.hypot(dx, dy)
      let ex = 1
      let ey = 0
      if (d > TINY) {
        ex = dx / d
        ey = dy / d
      }
      // Circle intersection on the +y side (left of GL → GR), clamped.
      const xc = clamp((d * d + pp - qq) / (2 * Math.max(d, TINY)), -p, p)
      const yc = Math.sqrt(Math.max(0, pp - xc * xc))
      const cx = glx + xc * ex - yc * ey
      const cy = gly + xc * ey + yc * ex
      // Unit directions glue → crease.
      let ux = cx - glx
      let uy = cy - gly
      const lu = Math.hypot(ux, uy)
      if (lu > TINY) {
        ux /= lu
        uy /= lu
      } else {
        ux = -ey
        uy = ex
      }
      let wx = cx - grx
      let wy = cy - gry
      const lw = Math.hypot(wx, wy)
      if (lw > TINY) {
        wx /= lw
        wy /= lw
      } else {
        wx = -ey
        wy = ex
      }
      // Out-of-fold bisector: (u + w) + (nL + nR), never zero for 0 ≤ θ_fold ≤ π.
      const fx = ux + wx - uy + wy
      const fy = uy + wy + ux - wx
      const lf = Math.hypot(fx, fy)
      const ox = lf > TINY ? fx / lf : 0
      const oy = lf > TINY ? fy / lf : 1

      left.position.set(glx, gly, 0)
      left.rotation.set(0, 0, Math.atan2(uy, ux)) // +x = u (dir +1), +y = rot90(u): outside
      right.position.set(grx, gry, 0)
      right.rotation.set(0, 0, Math.atan2(-wy, -wx)) // +x = −w (dir −1), +y: outside
      crease.position.set(cx, cy, 0)
      crease.rotation.set(0, 0, Math.atan2(ox, -oy)) // +y = −out
      ridge.position.set(cx, cy, 0)
      ridge.rotation.set(0, 0, Math.atan2(-ox, oy)) // +y = out

      fold._theta = Math.atan2(Math.abs(ux * wy - uy * wx), ux * wx + uy * wy)
      fold._height = cy
      fold.inner._pose()
    }
    this._mechanisms.push({ pose })
    pose()
    return fold
  }

  // The classic V-fold. See the header for frames and shapes. alpha is clamped
  // to [0, π/2] and gamma to [0, π]; alpha ≥ gamma clamps the crease onto the
  // nearest reachable direction (flat) instead of NaN.
  vFold({ on = this.root, z = 0.3, alpha = 0.5, gamma = 1.2, length = 0.5, toward = 'far' } = {}) {
    z = finite(z, 0.3)
    alpha = clamp(finite(alpha, 0.5), 0, HALF_PI)
    gamma = clamp(finite(gamma, 1.2), 0, Math.PI)
    length = Math.max(0, finite(length, 0.5))
    const s = toward === 'near' ? 1 : -1
    // dir that makes +y the outside face: right −s, left +s.
    const dirR = -s
    const dirL = s
    const id = `paper.vfold${++this._count}`
    const vdata = (dir) => ({ dir, length, z0: 0, z1: length, alpha, gamma, kind: 'v' })
    const left = frame(`${id}.left`, vdata(dirL))
    const right = frame(`${id}.right`, vdata(dirR))
    const crease = frame(`${id}.inner`, {})
    const ridge = frame(`${id}.ridge`, {})
    on.crease.add(left, right, crease, ridge)
    const fold = new Fold(left, right, ridge)
    const reach = length * Math.sin(gamma)
    fold.inner = new Hinge(crease, () => fold._theta, {
      name: `${id}.inner`,
      leftLength: reach,
      rightLength: reach,
      z0: 0,
      z1: length,
      outsideCrease: ridge,
    })
    const sa = Math.sin(alpha)
    const ca = Math.cos(alpha)
    const cg = Math.cos(gamma)

    const pose = () => {
      const h = on.theta * 0.5
      const sh = Math.sin(h)
      const ch = Math.cos(h)
      // β from g·c = cos γ: A sin β + B cos β = cos γ, rising branch.
      const A = sa * ch
      const R = Math.hypot(A, ca)
      const beta = Math.atan2(A, ca) + Math.acos(clamp(cg / Math.max(R, TINY), -1, 1))
      const sb = Math.sin(beta)
      const cb = Math.cos(beta)
      _c.set(0, sb, s * cb)

      _g.set(sa * sh, sa * ch, s * ca)
      poseVPanel(right, dirR, +1, sh, ch)
      right.position.set(0, 0, z)
      _g.set(-sa * sh, sa * ch, s * ca)
      poseVPanel(left, dirL, -1, sh, ch)
      left.position.set(0, 0, z)

      // inner: +z up the crease, +y into the V = (0, −cos β, s sin β), +x = (−s, 0, 0)
      _x.set(-s, 0, 0)
      _y.set(0, -cb, s * sb)
      setBasis(crease, _x, _y, _c)
      crease.position.set(0, 0, z)
      _x.set(s, 0, 0)
      _y.set(0, cb, -s * sb)
      setBasis(ridge, _x, _y, _c)
      ridge.position.set(0, 0, z)

      // Dihedral between the V's panels: twice the angle of a panel from inner +y.
      fold._theta = clamp(2 * Math.atan2(sa * sh, ca * sb - A * cb), 0, Math.PI)
      fold._height = length * sb
      fold.inner._pose()
    }
    this._mechanisms.push({ pose })
    pose()
    return fold
  }

  // One panel hinged on on.left / on.right. Not physical: lift(θ) is up to you
  // (θ = on.theta; return 0 at θ = 0). Non-finite lift values count as 0.
  flap({ on = this.root, side = 'right', x = 0.5, z = 0, alpha = 0, length = 0.3, lift = () => 0 } = {}) {
    const host = side === 'left' ? on.left : on.right
    const dir = host.userData && host.userData.dir < 0 ? -1 : 1
    x = finite(x, 0.5)
    z = finite(z, 0)
    alpha = finite(alpha, 0)
    length = Math.max(0, finite(length, 0.3))
    const panel = frame(`paper.flap${++this._count}`, { dir, length, z0: -length / 2, z1: length / 2, kind: 'flap' })
    panel.position.set(dir * x, FLAP_GAP, z)
    host.add(panel)
    const flap = new Flap(panel)
    const liftAt = typeof lift === 'function' ? lift : () => lift
    const pose = () => {
      const angle = finite(liftAt(on.theta), 0)
      flap._angle = angle
      // Euler XYZ = Ry(dir·alpha) · Rz(dir·angle): turn the hinge line in the
      // host plane, then lift the body (dir·x) toward +y about that line.
      panel.rotation.set(0, dir * alpha, dir * angle)
    }
    this._mechanisms.push({ pose })
    pose()
    return flap
  }

  // ---- helpers --------------------------------------------------------------

  card(frame, { length, z0, z1, material, shape, thickness = 0 } = {}) {
    const ud = frame.userData || {}
    const dir = ud.dir < 0 ? -1 : 1
    const L = Math.max(0, finite(length, finite(ud.length, 0.5)))
    const isV = ud.kind === 'v'
    const kind = shape ?? (isV ? 'tri' : 'rect')

    // Outline (and holes) in panel coords (s, t).
    let outline
    let holes = []
    if (kind && typeof kind === 'object' && typeof kind.extractPoints === 'function') {
      const pts = kind.extractPoints(12)
      outline = pts.shape.map((v) => [v.x, v.y])
      holes = pts.holes.map((hole) => hole.map((v) => [v.x, v.y]))
    } else if (isV) {
      const g = finite(ud.gamma, HALF_PI)
      const ks = L * Math.sin(g) // crease end K = (ks, kt)
      const kt = L * Math.cos(g)
      const w = Math.max(0, finite(z1, L)) // glue edge length
      if (kind === 'quad') outline = [[0, 0], [0, w], [ks, w + kt], [ks, kt]]
      else if (kind === 'rect') {
        const t0 = finite(z0, 0)
        outline = [[0, t0], [L, t0], [L, w], [0, w]]
      } else outline = [[0, 0], [0, w], [ks, kt]]
    } else {
      const t0 = finite(z0, finite(ud.z0, -0.5))
      const t1 = finite(z1, finite(ud.z1, 0.5))
      if (kind === 'tri') outline = [[0, t0], [0, t1], [L, (t0 + t1) / 2]]
      else outline = [[0, t0], [L, t0], [L, t1], [0, t1]]
    }

    // Build the 2D shape so the map to the frame has determinant +1 (keeps the
    // winding and the +y normals consistent): dir +1 draws (t, s), dir −1 (s, t).
    const v2 = dir > 0 ? ([s, t]) => new THREE.Vector2(t, s) : ([s, t]) => new THREE.Vector2(s, t)
    const sh = new THREE.Shape(outline.map(v2))
    for (const hole of holes) sh.holes.push(new THREE.Path(hole.map(v2)))
    const th = Math.max(0, finite(thickness, 0))
    const geometry =
      th > 0 ? new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false, curveSegments: 1 }) : new THREE.ShapeGeometry(sh, 1)
    const m = new THREE.Matrix4()
    if (dir > 0) m.set(0, 1, 0, 0, 0, 0, 1, -th / 2, 1, 0, 0, 0, 0, 0, 0, 1)
    else m.set(-1, 0, 0, 0, 0, 0, 1, -th / 2, 0, 1, 0, 0, 0, 0, 0, 1)
    geometry.applyMatrix4(m)
    projectUVs(geometry)
    this._geometries.push(geometry)

    const mesh = new THREE.Mesh(geometry, material ?? this.material({ color: '#f2e9d8' }))
    mesh.castShadow = true
    mesh.receiveShadow = true
    frame.add(mesh)
    return mesh
  }

  // A child of `frame` at body distance x (x ≥ 0 lands on the body whatever the
  // frame's dir), height y along its normal, z along its glue line. Inherits dir
  // so card() works on it; its length is what remains of the panel past x.
  place(frame, { x = 0, y = 0, z = 0 } = {}) {
    const ud = frame.userData || {}
    const dir = ud.dir < 0 ? -1 : 1
    x = finite(x, 0)
    y = finite(y, 0)
    z = finite(z, 0)
    const o = new THREE.Object3D()
    o.position.set(dir * x, y, z)
    const len = finite(ud.length, 0.5)
    o.userData = {
      dir,
      length: len - x > 1e-6 ? len - x : len,
      z0: finite(ud.z0, -0.5) - z,
      z1: finite(ud.z1, 0.5) - z,
    }
    frame.add(o)
    return o
  }

  material({ color = '#f2e9d8', roughness = 0.92, metalness = 0, side = THREE.DoubleSide, ...rest } = {}) {
    const opts = { color, roughness, metalness, side, ...rest }
    const key = materialKey(opts)
    let m = this._materials.get(key)
    if (!m) {
      m = new THREE.MeshStandardMaterial(opts)
      this._materials.set(key, m)
    }
    return m
  }

  // Deterministic 0..1 (mulberry32). Seed: a number or a string.
  rng(seed = 1) {
    let a = hashSeed(seed)
    return () => {
      a = (a + 0x6d2b79f5) >>> 0
      let t = a
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  // Frees the geometries and materials this Paper created (not textures you
  // passed in, not your own meshes). The frames stay where they are.
  dispose() {
    for (const g of this._geometries) g.dispose()
    for (const m of this._materials.values()) m.dispose()
    this._geometries.length = 0
    this._materials.clear()
  }
}
